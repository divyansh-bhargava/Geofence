#!/usr/bin/env python3
import sys
import json
import pickle
import numpy as np

def predict_behavior(ml_data):
    """
    Your ML prediction function
    This should interface with your trained model
    """
    # Example implementation - replace with your actual ML model
    cross_count = ml_data.get('cross_count', 0)
    duration = ml_data.get('duration', 24)
    
    # Simple rule-based example - replace with your ML model
    if cross_count > 10 or (cross_count > 5 and duration < 12):
        prediction = "anomalous"
        confidence = 0.85
    else:
        prediction = "normal"
        confidence = 0.92
    
    return {
        "prediction": prediction,
        "confidence": confidence,
        "details": {
            "cross_count_analysis": cross_count,
            "duration_analysis": duration
        }
    }

if __name__ == "__main__":
    try:
        # Read input data from command line arguments
        input_data = json.loads(sys.argv[1])
        
        # Get prediction from ML model
        result = predict_behavior(input_data)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        # Return fallback result in case of error
        error_result = {
            "prediction": "normal",
            "confidence": 0.5,
            "details": {
                "error": str(e),
                "fallback": True
            }
        }
        print(json.dumps(error_result))