from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow import keras
from PIL import Image
import numpy as np
import io

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
model = keras.models.load_model("cat-vs-dog74Acc.keras", compile=False)

# Preprocessing function
def preprocess_image(image):
    img = Image.open(io.BytesIO(image))
    img = img.resize((256, 256))  # Resize to match model training size
    img = np.array(img) / 255.0  # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension

    print("Image shape before prediction:", img.shape)  # Debugging print
    return img

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    image_data = await file.read()
    img = preprocess_image(image_data)

    prediction = model.predict(img)
    predicted_class = "Dog" if prediction[0][0] > 0.5 else "Cat"
    confidence = round(float(prediction[0][0]) * 100, 2) if predicted_class == "Dog" else round((1 - float(prediction[0][0])) * 100, 2)

    return {"class": predicted_class, "confidence": confidence}
