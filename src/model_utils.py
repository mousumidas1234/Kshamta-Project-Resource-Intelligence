from pathlib import Path
import joblib
ROOT=Path(__file__).resolve().parents[1]; MODEL_PATH=ROOT/"models"/"attrition_model.joblib"
def load_model(): return joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None
def risk_category(p): return "High" if p>=.67 else "Medium" if p>=.34 else "Low"
