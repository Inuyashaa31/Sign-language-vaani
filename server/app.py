from flask import Flask, request, jsonify, render_template, Response
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
import base64
from tensorflow.keras.models import load_model, model_from_json

app = Flask(__name__)
CORS(app)

# Load models
# Load alphabet model
with open("model.json", "r") as json_file:
    model_json = json_file.read()
alphabet_model = model_from_json(model_json)
alphabet_model.load_weights("model.h5")

# Load action model
action_model = load_model('action1.h5')

# Labels
actions = np.array(['hello', 'thanks', 'iloveyou', 'victory'])
alphabets = [chr(i) for i in range(65, 91)]  # A-Z

# Threshold and sequence state
sequence = []
sentence = []
threshold = 0.8

# Mediapipe
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

# Camera control
cap = None
is_running = False

# ---- KEYPOINT EXTRACTION ----
def extract_keypoints(results):
    # Full holistic keypoints (used for action model)
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]) if results.pose_landmarks else np.zeros((33, 4))
    face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]) if results.face_landmarks else np.zeros((468, 3))
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]) if results.left_hand_landmarks else np.zeros((21, 3))
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]) if results.right_hand_landmarks else np.zeros((21, 3))
    return np.concatenate([pose.flatten(), face.flatten(), lh.flatten(), rh.flatten()])

def extract_hand_keypoints(results):
    # Only hands (used for alphabet model)
    if results.multi_hand_landmarks:
        hand = results.multi_hand_landmarks[0]
        return np.array([[res.x, res.y, res.z] for res in hand.landmark]).flatten()
    else:
        return np.zeros((21 * 3,))

def mediapipe_detection(image, model):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = model.process(image_rgb)
    return image, results

# ---- VIDEO STREAM ----
def generate_frames():
    global cap, is_running, sequence, sentence
    cap = cv2.VideoCapture(0)
    is_running = True
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened() and is_running:
            ret, frame = cap.read()
            if not ret:
                break
            image, results = mediapipe_detection(frame, holistic)
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            sequence = sequence[-30:]

            if len(sequence) == 30:
                res = action_model.predict(np.expand_dims(sequence, axis=0))[0]
                if res[np.argmax(res)] > threshold:
                    if len(sentence) == 0 or actions[np.argmax(res)] != sentence[-1]:
                        sentence.append(actions[np.argmax(res)])
                if len(sentence) > 5:
                    sentence = sentence[-5:]

            text = " ".join(sentence)
            x, y = 10, 30
            (text_width, text_height), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)
            cv2.rectangle(image, (x - 5, y - text_height - 5), (x + text_width + 5, y + 5), (255, 255, 255), -1)
            cv2.putText(image, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            _, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()
    is_running = False

# ---- ROUTES ----
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/stop_video_feed", methods=["POST"])
def stop_video_feed():
    global is_running, cap
    is_running = False
    if cap:
        cap.release()
        cap = None
    return jsonify({"status": "Camera stopped"})

@app.route("/predict_alphabet", methods=["POST"])
def predict_alphabet():
    try:
        data = request.get_json()
        frame_data = data.get("frame", "")
        if not frame_data:
            return jsonify({"error": "No frame provided"}), 400

        # Remove base64 prefix
        if ',' in frame_data:
            frame_data = frame_data.split(",")[1]

        # Decode
        image_data = base64.b64decode(frame_data)
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Detect hands only
        with mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5) as hands:
            image, results = mediapipe_detection(image, hands)
            keypoints = extract_hand_keypoints(results)

        if keypoints is None or keypoints.shape != (63,):
            return jsonify({"error": "No hand landmarks found"}), 400

        # Create 30-frame sequence
        sequence_input = np.array([keypoints] * 30)  # shape (30, 63)
        sequence_input = np.expand_dims(sequence_input, axis=0)  # shape (1, 30, 63)

        # Predict
        res = alphabet_model.predict(sequence_input)[0]
        prediction = alphabets[np.argmax(res)]

        return jsonify({"prediction": prediction})

    except Exception as e:
        print("PREDICT ALPHABET ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
