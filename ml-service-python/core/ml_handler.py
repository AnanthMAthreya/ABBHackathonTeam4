# Path: ml_service/app/ml_handler.py
import pandas as pd
import lightgbm as lgb
import joblib
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from typing import Dict, Any, List
import os

MODEL_DIR = "model_artifacts"
MODEL_PATH = os.path.join(MODEL_DIR, "model.joblib")
TARGET_COLUMN = "Response"

def train_model(train_data: List[Dict[str, Any]], test_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    os.makedirs(MODEL_DIR, exist_ok=True)

    df_train = pd.DataFrame(train_data)
    df_test = pd.DataFrame(test_data)

    print("Columns received in training data:", df_train.columns)

    features_to_drop = [TARGET_COLUMN, 'id', 'syntheticTimestamp']

    X_train = df_train.drop(columns=features_to_drop, errors='ignore')
    y_train = df_train[TARGET_COLUMN]

    X_test = df_test.drop(columns=features_to_drop, errors='ignore')
    y_test = df_test[TARGET_COLUMN]

    lgbm = lgb.LGBMClassifier(objective='binary', random_state=42)
    lgbm.fit(X_train, y_train)

    joblib.dump(lgbm, MODEL_PATH)

    y_pred = lgbm.predict(X_test)
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, zero_division=0.0),
        "recall": recall_score(y_test, y_pred, zero_division=0.0),
        "f1_score": f1_score(y_test, y_pred, zero_division=0.0),
        "confusion_matrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)}
    }

    return metrics

def predict_single(features: Dict[str, Any]) -> Dict[str, Any]:
    try:
        model = joblib.load(MODEL_PATH)
    except FileNotFoundError:
        raise RuntimeError("Model not found. Please train the model first.")

    df = pd.DataFrame([features])

    prediction = model.predict(df)[0]
    confidence = model.predict_proba(df).max()

    return {
        "prediction": int(prediction),
        "confidence": float(confidence)
    }
