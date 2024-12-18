import numpy as np
import os

# Ensure the directory exists
os.makedirs('public/ai-model', exist_ok=True)

# Create input data (example: 10 samples with 5 features)
input_data = np.random.rand(10, 5)
np.save('public/ai-model/input_data.npy', input_data)

# Create metadata (example: corresponding labels or additional information)
metadata = np.array([
    'class_a', 'class_b', 'class_c', 'class_a', 'class_b', 
    'class_c', 'class_a', 'class_b', 'class_c', 'class_a'
])
np.save('public/ai-model/metadata.npy', metadata)

print("NumPy files generated successfully:")
print("1. public/ai-model/input_data.npy")
print("2. public/ai-model/metadata.npy")
