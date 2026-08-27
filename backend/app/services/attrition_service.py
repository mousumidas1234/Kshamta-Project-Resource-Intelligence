from functools import lru_cache
import joblib, pandas as pd
from ..core.config import MODEL_PATH

@lru_cache(maxsize=1)
def model_bundle():
    if not MODEL_PATH.exists(): raise FileNotFoundError("Attrition model has not been trained")
    return joblib.load(MODEL_PATH)

def metrics():
    b=model_bundle(); return {"selected_model":b["selected_model"],"metrics":b["metrics"]}
def predict(values):
    b=model_bundle(); row=pd.DataFrame([values],columns=b["features"]); p=float(b["model"].predict_proba(row)[0,1]); return {"probability":p,"risk_category":"High" if p>=.67 else "Medium" if p>=.34 else "Low","model_used":b["selected_model"],"disclaimer":"The prediction is a statistical estimate and is not a guarantee that an employee will leave."}
