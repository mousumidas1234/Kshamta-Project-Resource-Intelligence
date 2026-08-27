from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data_cleaned"

def _read(name: str) -> pd.DataFrame:
    path = DATA_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Required dataset not found: {path}")
    frame = pd.read_csv(path)
    if frame.empty:
        raise ValueError(f"Dataset is empty: {path.name}")
    return frame

def _boolean(series: pd.Series) -> pd.Series:
    return series.astype(str).str.strip().str.lower().isin(["true", "1", "yes", "y"])

def load_data():
    tasks, forms, employees = _read("tasks_clean.csv"), _read("forms_clean.csv"), _read("employees_clean.csv")
    for frame, dates in [(tasks, ["Created", "Target", "Status Changed"]), (forms, ["Created", "Status Changed"])]:
        for col in dates:
            if col in frame: frame[col] = pd.to_datetime(frame[col], errors="coerce")
        for col in frame.select_dtypes(include="object"):
            frame[col] = frame[col].fillna("Unknown")
        if "OverDue" in frame: frame["OverDue"] = _boolean(frame["OverDue"])
    for col in ["monthly_salary", "avg_weekly_hours", "projects_handled", "performance_rating", "absences_days", "job_satisfaction"]:
        if col in employees: employees[col] = pd.to_numeric(employees[col], errors="coerce")
    for col in ["department", "role_level", "attrition"]:
        if col in employees: employees[col] = employees[col].fillna("Unknown").astype(str)
    return tasks, forms, employees
