import os
import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs

# Path to the Keras model
keras_model_path = 'public/ai-model/saved_model/TrainedModelV5.keras'
output_dir = 'public/ai-model/tfjs_model'

def convert_keras_to_tfjs():
    try:
        # Load the Keras model
        model = keras.models.load_model(keras_model_path)
        
        # Print model summary for debugging
        model.summary()
        
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        # Convert and save the model in TensorFlow.js format
        tfjs.converters.save_keras_model(model, output_dir)
        print(f"Model successfully converted and saved to {output_dir}")
        
        # Additional model information
        print("\nModel Configuration:")
        print(f"Input Shape: {model.input_shape}")
        print(f"Output Shape: {model.output_shape}")
        print(f"Number of Layers: {len(model.layers)}")
        
    except Exception as e:
        print(f"Conversion Error: {e}")
        # Detailed error handling
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    convert_keras_to_tfjs()
