import tensorflowjs as tfjs
import tensorflow as tf
import os

def convert_keras_to_tfjs():
    try:
        # Load the Keras model
        input_path = 'public/model/water_hyacinth_modelV2.keras'
        output_path = 'public/model'
        
        # Create output directory if it doesn't exist
        if not os.path.exists(output_path):
            os.makedirs(output_path)
        
        # Load and convert the model
        model = tf.keras.models.load_model(input_path)
        
        # Convert the model
        tfjs.converters.save_keras_model(model, output_path)
        print(f"Model successfully converted and saved to {output_path}")
        
    except Exception as e:
        print(f"Error converting model: {str(e)}")

if __name__ == '__main__':
    convert_keras_to_tfjs()