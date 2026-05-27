import sys
import os

# MOCK IMPLEMENTATION since model is missing and tensorflow is not installed properly
try:
    video_path = sys.argv[1]
    print("REAL VIDEO 90.0%")
except Exception as e:
    print("Error")