import json
import tensorflow as tf

# Correct path to config.json
config_path = "cat-vs-dog74Acc.keras/config.json"

# Load the model configuration
with open(config_path, "r") as json_file:
    config = json.load(json_file)

# Load weights from .h5 file
weights_path = "cat-vs-dog74Acc.keras/model.weights.h5"
model = tf.keras.models.load_model("cat-vs-dog74Acc.keras")

model.load_weights(weights_path)

# Save the fixed model
model.save("cat-vs-dog74Acc-fixed.keras")

print("✅ Model conversion successful: cat-vs-dog74Acc-fixed.keras")
