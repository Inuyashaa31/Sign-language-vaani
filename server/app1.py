from function import *
from flask_cors import CORS  # Import CORS
from keras.utils import to_categorical
from keras.models import model_from_json
from keras.layers import LSTM, Dense
from keras.callbacks import TensorBoard
import base64
import cv2
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)
json_file = open("model.json", "r")
model_json = json_file.read()
json_file.close()
model = model_from_json(model_json)
model.load_weights("model.h5")

json_file2 = open("model.json", "r")
alphabet_model_json = json_file2.read()
json_file2.close()
alphabet_model = model_from_json(alphabet_model_json)
alphabet_model.load_weights("model.h5")

colors = []
for i in range(0, 20):
    colors.append((245, 117, 16))

def prob_viz(res, actions, input_frame, colors, threshold):
    output_frame = input_frame.copy()
    for num, prob in enumerate(res):
        cv2.rectangle(output_frame, (0, 60 + num * 40), (int(prob * 100), 90 + num * 40), colors[num], -1)
        cv2.putText(output_frame, actions[num], (0, 85 + num * 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
    return output_frame

@app.route("/predict_alphabet", methods=["POST"])
def predict_alphabet():
    data = request.get_json()
    frame_data = data.get("frame", "")
    if not frame_data:
        return jsonify({"error": "No frame provided"})

    image_data = base64.b64decode(frame_data.split(",")[1])
    np_arr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    image, results = mediapipe_detection(image, mp_hands.Hands())

    keypoints = extract_keypoints(results)
    sequence = [keypoints] * 30  # Simulate sequence
    res = alphabet_model.predict(np.expand_dims(sequence, axis=0))[0]
    prediction = actions[np.argmax(res)]

    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True)
