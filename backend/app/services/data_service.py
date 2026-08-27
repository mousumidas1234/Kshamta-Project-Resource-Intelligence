from functools import lru_cache
import pandas as pd
from ..core.config import DATA_DIR

def _read(name):
    path=DATA_DIR/name
    if not path.exists(): raise FileNotFoundError(f"Required dataset is unavailable: {name}")
    df=pd.read_csv(path)
    if df.empty: raise ValueError(f"Dataset is empty: {name}")
    return df

@lru_cache(maxsize=1)
def datasets():
    tasks, forms, employees = _read("tasks_clean.csv"), _read("forms_clean.csv"), _read("employees_clean.csv")
    for frame, dates in [(tasks,["Created","Target","Status Changed"]),(forms,["Created","Status Changed"])]:
        for date in dates:
            if date in frame: frame[date]=pd.to_datetime(frame[date],errors="coerce")
        for col in frame.select_dtypes(include="object"): frame[col]=frame[col].fillna("Unknown")
        if "OverDue" in frame: frame["OverDue"]=frame["OverDue"].astype(str).str.lower().isin(["true","yes","1"])
    for col in ["monthly_salary","avg_weekly_hours","projects_handled","performance_rating","absences_days","job_satisfaction"]: employees[col]=pd.to_numeric(employees[col],errors="coerce")
    for col in ["department","role_level","attrition"]: employees[col]=employees[col].fillna("Unknown").astype(str)
    return tasks,forms,employees

def records(frame):
    return frame.where(pd.notna(frame),None).to_dict(orient="records")
