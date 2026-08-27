import numpy as np
import pandas as pd

NUMERIC=["monthly_salary","avg_weekly_hours","projects_handled","performance_rating","absences_days","job_satisfaction"]
def employee_frame(employees: pd.DataFrame) -> pd.DataFrame:
    out=employees.copy()
    for col in NUMERIC:
        if col in out: out[col]=pd.to_numeric(out[col],errors="coerce"); out[col]=out[col].fillna(out[col].median())
    out["attrition_flag"]=out.get("attrition","Unknown").astype(str).str.lower().isin(["yes","1","true"])
    return out

def workforce_kpis(employees):
    e=employee_frame(employees)
    return {"Total Employees":len(e),"Average Weekly Hours":e.avg_weekly_hours.mean(),"Average Projects Handled":e.projects_handled.mean(),"Average Performance Rating":e.performance_rating.mean(),"Average Absence Days":e.absences_days.mean(),"Attrition Rate":100*e.attrition_flag.mean(),"Average Job Satisfaction":e.job_satisfaction.mean()}
