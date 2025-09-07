# Path: ml-service-python/main.py
from fastapi import FastAPI, HTTPException
import joblib

# === THIS IS THE FIX ===
# We are changing the imports from relative (.models) to absolute (core.models)
# because main.py is no longer inside a package.
from core.models import TrainRequest, TrainResponse, PredictRequest, PredictResponse
from core import ml_handler
# =======================

app = FastAPI(
    title="IntelliInspect ML Service",
    version="1.0.0"
)

# --- The rest of the file is unchanged and correct ---

model_is_trained = False

@app.on_event("startup")
def startup_event():
    global model_is_trained
    try:
        joblib.load(ml_handler.MODEL_PATH)
        model_is_trained = True
    except FileNotFoundError:
        model_is_trained = False

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "ML service is running"}

@app.post("/train-model", response_model=TrainResponse, response_model_by_alias=True, tags=["Training"])
def train(request: TrainRequest):
    if not request.train_data or not request.test_data:
        raise HTTPException(status_code=400, detail="Training and testing data cannot be empty.")

    try:
        metrics = ml_handler.train_model(request.train_data, request.test_data)
        global model_is_trained
        model_is_trained = True
        return TrainResponse(**metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict", response_model=PredictResponse, tags=["Prediction"])
def predict(request: PredictRequest):
    if not model_is_trained:
        raise HTTPException(status_code=400, detail="Model is not trained yet. Please call /train-model first.")

    try:
        result = ml_handler.predict_single(request.features)
        return PredictResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
