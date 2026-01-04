import pickle
import pandas as pd
import os

class StudentPerformanceModel:
    def __init__(self, model_path="backend/student_model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Run train_model.py first.")
        
        with open(model_path, 'rb') as f:
            self.model = pickle.load(f)
            
    def predict(self, study_hours, attendance, prev_gpa):
        """
        Predicts the student score based on inputs.
        """
        input_data = pd.DataFrame({
            'study_hours': [study_hours],
            'attendance': [attendance],
            'prev_gpa': [prev_gpa]
        })
        
        prediction = self.model.predict(input_data)[0]
        return prediction

# Singleton instance
# _model = StudentPerformanceModel()
# def predict_score(s, a, p):
#     return _model.predict(s, a, p)
