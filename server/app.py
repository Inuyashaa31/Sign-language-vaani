# Necessary Imports
import cv2
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Allow CORS for frontend requests

# Load Pre-trained Model
model = load_model("action.h5")

# Mediapipe models
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

# Define actions
actions = np.array(['hello', 'thanks', 'iloveyou'])  # Modify as needed
threshold = 0.8  # Confidence threshold

# Helper Functions
def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468*3)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, face, lh, rh])

# Flask API Route to Accept Video Frames
@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["video"]
    
    # Convert file to OpenCV format
    file_bytes = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Process the frame with Mediapipe
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        image, results = frame, holistic.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        # Extract keypoints
        keypoints = extract_keypoints(results)

        # Predict only if we have enough frames
        if keypoints.shape[0] > 0:
            keypoints = keypoints.reshape(1, -1, keypoints.shape[0])
            res = model.predict(keypoints)[0]

            # Get highest probability action
            if res[np.argmax(res)] > threshold:
                prediction = actions[np.argmax(res)]
            else:
                prediction = "No action detected"

            return jsonify({"prediction": prediction, "confidence": float(res[np.argmax(res)])})

    return jsonify({"error": "Failed to process frame"}), 400

# Run the Flask Server
if __name__ == "__main__":
    app.run(debug=True)
