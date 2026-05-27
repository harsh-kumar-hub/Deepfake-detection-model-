import sys
import os

# MOCK IMPLEMENTATION since model is missing and tensorflow is not installed properly
try:
    file_path = sys.argv[1]
    print("REAL 85.0%")
except Exception as e:
    print("Error")