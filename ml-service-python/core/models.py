# Path: ml_service/app/models.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any

class TrainRequest(BaseModel):
    train_data: List[Dict[str, Any]] = Field(..., alias='trainData')
    test_data: List[Dict[str, Any]] = Field(..., alias='testData')

    class Config:
        populate_by_name = True

class TrainResponse(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float = Field(..., alias='f1Score')
    confusion_matrix: Dict[str, int] = Field(..., alias='confusionMatrix')

    class Config:
        populate_by_name = True

class PredictRequest(BaseModel):
    features: Dict[str, Any]

class PredictResponse(BaseModel):
    prediction: int
    confidence: float
