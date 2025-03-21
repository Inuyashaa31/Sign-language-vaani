import base64
import io
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model

app = FastAPI()

# Load your Keras model
model = load_model('model.h5')

# Allow CORS for your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image: Image.Image) -> np.ndarray:
    # Resize the image to the input size expected by the model
    image = image.resize((224, 224))  # Adjust to your model's input size
    # Convert image to array
    image_array = np.array(image)
    # Normalize the image array (if required by your model)
    image_array = image_array / 255.0
    # Expand dimensions to match the model's input shape
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.post("/predict-frame/")
async def predict_frame(request: Request):
    data = await request.json()
    frame_data = data.get("frame")

    if frame_data:
        # Decode the base64 string to image
        image_data = base64.b64decode(frame_data.split(",")[1])
        image = Image.open(io.BytesIO(image_data))

        # Preprocess the image
        preprocessed_image = preprocess_image(image)

        # Make predictions
        predictions = model.predict(preprocessed_image)
        predicted_class = np.argmax(predictions, axis=1)  # Get the predicted class index
        # Convert predicted class to a human-readable label if necessary
        # For example, you could map class indices to labels

        return {"message": "Frame processed successfully", "predicted_class": int(predicted_class[0])}
    return {"error": "No frame data received"}

# To run the server, use the command: uvicorn main:app --reload
