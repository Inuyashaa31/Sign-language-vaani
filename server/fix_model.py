import tensorflow as tf
from tensorflow import keras
import h5py
import json

# Register Sequential class to avoid TypeError
from keras.saving import register_keras_serializable

@register_keras_serializable()
class Sequential(keras.Sequential):
    pass

model_path = 'C:/Projects/Sign Language/server/action.h5'
new_model_path = 'C:/Projects/Sign Language/server/fixed_action.h5'

# Load the model structure from the HDF5 file
try:
    with h5py.File(model_path, 'r') as f:
        model_config = f.attrs.get('model_config')

    # Convert the model config to a JSON string
    model_config_json = json.loads(model_config)

    # Remove the 'time_major' argument from the LSTM layers in the JSON config
    for layer in model_config_json['config']['layers']:
        if layer['class_name'] == 'LSTM' and 'time_major' in layer['config']:
            layer_name = layer.get('name', 'Unnamed Layer')
            print(f"Removing time_major from layer: {layer_name}")
            del layer['config']['time_major']

    # Convert back to JSON string
    updated_model_json = json.dumps(model_config_json)

    # Rebuild the model without 'time_major'
    try:
        # Use the custom Sequential class when loading the model from JSON
        updated_model = keras.models.model_from_json(updated_model_json, custom_objects={'Sequential': Sequential})
    except Exception as e:
        print(f"Error while loading model from JSON: {e}")
        updated_model = None  # Set to None to avoid further errors

    # Proceed only if the model was successfully created
    if updated_model is not None:
        # Load the model weights
        updated_model.load_weights(model_path)

        # Save the updated model
        updated_model.save(new_model_path)
        print(f"Model saved at {new_model_path}")
    else:
        print("Model creation failed. Cannot load weights or save.")

except Exception as e:
    print(f"An error occurred: {e}")
