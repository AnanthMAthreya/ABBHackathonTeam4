from fastapi import FastAPI, Body
app = FastAPI()

@app.post("/train-model")
def train_model(payload: dict = Body(...)):
    return {
        "status": "trained",
        "metrics": {"accuracy": 0.85, "precision": 0.82, "recall": 0.80, "f1": 0.81},
        "charts": {"trainingCurve": None, "confusionMatrix": None}
    }

# backend polls this in batches
@app.post("/simulate-batch")
def simulate_batch(payload: dict = Body(...)):
    cursor = int(payload.get("cursor", 0))
    take   = int(payload.get("take", 25))
    events = []
    for i in range(cursor, cursor + take):
        events.append({
            "timestamp": "2021-10-01T00:00:01",
            "sampleId": i,
            "prediction": "pass" if i % 3 else "fail",
            "confidence": 0.75,
            "temperature": 25.0,
            "pressure": 1013.0,
            "humidity": 40.0
        })
    # after ~200 records, stop
    return events if cursor < 200 else []
