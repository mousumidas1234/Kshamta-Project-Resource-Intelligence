from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = ROOT / "data_cleaned"
MODEL_PATH = ROOT / "models" / "attrition_model.joblib"
SECRET = os.getenv("KSHAMTA_DEMO_SECRET", "change-this-demo-secret")
USERS_DB_PATH = Path(os.getenv("KSHAMTA_USERS_DB", str(ROOT / "kshamta_users.db")))
