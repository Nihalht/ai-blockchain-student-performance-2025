from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from contextlib import asynccontextmanager
try:
    from backend.model import StudentPerformanceModel
except ImportError:
    from model import StudentPerformanceModel


model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        model = StudentPerformanceModel()
        print("AI Model loaded successfully.")
    except Exception as e:
        print(f"Failed to load model: {e}")
    yield
    model = None

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Student Performance AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StudentRecord(BaseModel):
    semester: str
    subject: str
    score: float
    study_hours: float
    attendance: float
    previous_gpa: float

class PredictionRequest(BaseModel):
    study_hours: float
    attendance: float
    previous_gpa: float

@app.get("/")
def read_root():
    return {"message": "AI Analytics Engine is running"}

@app.post("/predict")
def predict(request: PredictionRequest):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    predicted_score = model.predict(request.study_hours, request.attendance, request.previous_gpa)
    
    predicted_grade = "A" if predicted_score > 90 else "B" if predicted_score > 80 else "C" if predicted_score > 70 else "D"
    
    return {
        "predicted_score": round(predicted_score, 2),
        "predicted_grade": predicted_grade,
        "risk_level": "Low" if predicted_score > 75 else "High"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
