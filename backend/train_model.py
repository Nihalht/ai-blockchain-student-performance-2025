import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import pickle

def generate_data(n_samples=1000):
    np.random.seed(42)
    
    # Features: Study Hours, Attendance (%), Previous GPA, Extracurricular Activity (0-10)
    study_hours = np.random.normal(20, 10, n_samples) # Mean 20 hours/week, SD 10
    study_hours = np.clip(study_hours, 0, 100)
    
    attendance = np.random.normal(85, 10, n_samples)
    attendance = np.clip(attendance, 50, 100)
    
    prev_gpa = np.random.normal(3.0, 0.5, n_samples)
    prev_gpa = np.clip(prev_gpa, 0.0, 4.0)
    
    # Target: Final Score (0-100)
    # Formula: Base + (Study * 0.5) + (Attendance * 0.3) + (GPA * 10) + Noise
    score = 10 + (study_hours * 0.5) + (attendance * 0.3) + (prev_gpa * 15) + np.random.normal(0, 5, n_samples)
    score = np.clip(score, 0, 100)
    
    df = pd.DataFrame({
        'study_hours': study_hours,
        'attendance': attendance,
        'prev_gpa': prev_gpa,
        'final_score': score
    })
    
    return df

def train():
    print("Generating synthetic dataset...")
    df = generate_data()
    
    X = df[['study_hours', 'attendance', 'prev_gpa']]
    y = df['final_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    score = model.score(X_test, y_test)
    print(f"Model R2 Score: {score:.2f}")
    
    with open('backend/student_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    print("Model saved to backend/student_model.pkl")

if __name__ == "__main__":
    train()
