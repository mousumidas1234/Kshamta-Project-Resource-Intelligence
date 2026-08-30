import pandas as pd
from .data_service import datasets, records

def frame():
    *_, e=datasets(); e=e.copy()
    from ..core.users import _connect
    with _connect() as db:
        task_workloads = pd.read_sql_query("""
            SELECT employee_id, SUM(assigned_hours) as task_hours, COUNT(DISTINCT project) as task_projects
            FROM task_assignments ta
            JOIN tasks t ON ta.task_id = t.id
            WHERE t.Status NOT IN ('Closed', 'Complete', 'Completed')
            GROUP BY employee_id
        """, db)
    e = e.merge(task_workloads, on="employee_id", how="left").fillna({"task_hours": 0.0, "task_projects": 0})
    e["avg_weekly_hours"] = e["avg_weekly_hours"] + e["task_hours"]
    e["projects_handled"] = e["projects_handled"] + e["task_projects"]
    e = e.drop(columns=["task_hours", "task_projects"])
    
    for col in ["monthly_salary","avg_weekly_hours","projects_handled","performance_rating","absences_days","job_satisfaction"]: e[col]=e[col].fillna(e[col].median())
    e["attrition_flag"]=e.attrition.str.lower().isin(["yes","true","1"])
    return e


def overview():
    e=frame(); metrics={"total_employees":len(e),"average_weekly_hours":round(e.avg_weekly_hours.mean(),1),"average_projects_handled":round(e.projects_handled.mean(),1),"average_performance_rating":round(e.performance_rating.mean(),1),"average_absence_days":round(e.absences_days.mean(),1),"attrition_rate":round(100*e.attrition_flag.mean(),1),"average_job_satisfaction":round(e.job_satisfaction.mean(),1)}
    count=lambda col: records(e.groupby(col).size().reset_index(name="value"))
    attr=lambda col: records(e.groupby(col).attrition_flag.mean().mul(100).round(1).reset_index(name="value"))
    return {"metrics":metrics,"charts":{"employees_by_department":count("department"),"employees_by_role":count("role_level"),"weekly_hours_distribution":records(e[["avg_weekly_hours"]]),"projects_distribution":records(e[["projects_handled"]]),"performance_distribution":records(e[["performance_rating"]]),"satisfaction_distribution":records(e[["job_satisfaction"]]),"attrition_by_department":attr("department"),"attrition_by_role":attr("role_level"),"weekly_hours_vs_attrition":records(e[["attrition","avg_weekly_hours"]]),"projects_vs_attrition":records(e[["attrition","projects_handled"]]),"satisfaction_vs_attrition":records(e[["attrition","job_satisfaction"]])}}

def employee(employee_id):
    e=frame(); found=e[e.employee_id.astype(str)==str(employee_id)]
    return None if found.empty else records(found)[0]

def employees(): return records(frame())
