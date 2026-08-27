import numpy as np
import pandas as pd
from .employee_features import employee_frame

def recommend(employees, department, role_level, workload, min_performance):
    e=employee_frame(employees); capacity=(40-e.avg_weekly_hours).clip(lower=0)
    dep=(e.department.astype(str)==str(department))*25; role=(e.role_level.astype(str)==str(role_level))*20
    perf=(e.performance_rating>=min_performance)*15; cap=(capacity>=workload)*20
    projects=10*(1-(e.projects_handled/e.projects_handled.max().replace(0,1) if hasattr(e.projects_handled.max(),'replace') else e.projects_handled/e.projects_handled.max())).fillna(0)
    absence=5*(1-e.absences_days/e.absences_days.max()).fillna(0); satisfaction=5*(e.job_satisfaction/e.job_satisfaction.max()).fillna(0)
    e["Suitability Score"]=(dep+role+perf+cap+projects+absence+satisfaction).round(1)
    e["Recommendation"]=pd.cut(e["Suitability Score"],[-1,44,69,100],labels=["Avoid","Consider","Recommended"]).astype(str)
    e["Explanation"]=np.where((dep>0)&(role>0)&(cap>0),"Department and role match with simulated capacity available.","Hypothetical fit is limited by department, role, or estimated capacity.")
    e["Available Simulated Capacity"] = capacity.round(1)
    return e.sort_values("Suitability Score",ascending=False)
