import pandas as pd
from ..core.users import _connect

def datasets():
    with _connect() as db:
        tasks = pd.read_sql_query("SELECT * FROM tasks", db)
        forms = pd.read_sql_query("SELECT * FROM forms", db)
        employees = pd.read_sql_query("SELECT * FROM employees", db)
        
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
