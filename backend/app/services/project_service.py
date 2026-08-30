import pandas as pd
from .data_service import datasets, records

def summary():
    tasks,forms,_=datasets(); t=tasks.copy(); t["project"]=t.project.fillna("Unknown").astype(str)
    t["is_open"]=~t.Status.astype(str).str.lower().isin(["closed","complete","completed"])
    t["is_high"]=t.Priority.astype(str).str.contains("high|urgent|critical",case=False,regex=True)
    t["is_safety"]=t["Task Group"].astype(str).str.contains("safety",case=False)|t.Type.astype(str).str.contains("safety",case=False)
    out=t.groupby("project").agg(total_tasks=("project","size"),open_tasks=("is_open","sum"),overdue_tasks=("OverDue","sum"),high_priority_tasks=("is_high","sum"),safety_tasks=("is_safety","sum")).reset_index()
    out["closed_tasks"]=out.total_tasks-out.open_tasks; out["completion_rate"]=(100*out.closed_tasks/out.total_tasks).round(1)
    f=forms.copy(); f["project"]=f.Project.fillna("Unknown").astype(str); f["open_actions"]=pd.to_numeric(f["Open Actions"],errors="coerce").fillna(0); f["total_actions"]=pd.to_numeric(f["Total Actions"],errors="coerce").fillna(0)
    fg=f.groupby("project").agg(total_forms=("project","size"),open_actions=("open_actions","sum"),total_actions=("total_actions","sum")).reset_index()
    merged = out.merge(fg,on="project",how="left").fillna(0)
    
    from ..core.users import _connect
    with _connect() as db:
        projects_df = pd.read_sql_query("SELECT id AS project, name, status, priority, deadline FROM projects", db)
        
    final_df = projects_df.merge(merged, on="project", how="left").fillna(0)
    for col in ["total_tasks", "open_tasks", "overdue_tasks", "high_priority_tasks", "safety_tasks", "closed_tasks", "total_forms", "open_actions", "total_actions"]:
        if col in final_df: final_df[col] = final_df[col].astype(int)
    return final_df


def analytics(project=None, task_group=None, status=None, priority=None, start=None, end=None):
    tasks,forms,_=datasets(); x=tasks.copy()
    for col, value in [("project",project),("Task Group",task_group),("Status",status),("Priority",priority)]:
        if value: x=x[x[col].astype(str)==str(value)]
    if start: x=x[x.Created >= pd.Timestamp(start)]
    if end: x=x[x.Created <= pd.Timestamp(end)]
    open_mask=~x.Status.astype(str).str.lower().isin(["closed","complete","completed"]); high=x.Priority.astype(str).str.contains("high|urgent|critical",case=False,regex=True); safety=x["Task Group"].astype(str).str.contains("safety",case=False)|x.Type.astype(str).str.contains("safety",case=False)
    metrics={"total_tasks":len(x),"open_tasks":int(open_mask.sum()),"closed_tasks":int((~open_mask).sum()),"overdue_tasks":int(x.OverDue.sum()),"completion_rate":round(100*(~open_mask).mean(),1) if len(x) else 0,"safety_tasks":int(safety.sum()),"high_priority_tasks":int(high.sum()),"total_forms":len(forms),"open_actions":int(pd.to_numeric(forms["Open Actions"],errors="coerce").fillna(0).sum()),"total_actions":int(pd.to_numeric(forms["Total Actions"],errors="coerce").fillna(0).sum())}
    def grouped(col,name): return records(x.groupby(col).size().reset_index(name=name))
    completed=x.assign(completed=(~open_mask).astype(int)).groupby("project").agg(tasks=("project","size"),completion_rate=("completed",lambda s:round(100*s.mean(),1))).reset_index()
    return {"metrics":metrics,"filters":{"projects":sorted(tasks.project.astype(str).unique()),"task_groups":sorted(tasks["Task Group"].astype(str).unique()),"statuses":sorted(tasks.Status.astype(str).unique()),"priorities":sorted(tasks.Priority.astype(str).unique())},"charts":{"tasks_by_project":grouped("project","value"),"tasks_by_status":grouped("Status","value"),"tasks_by_group":grouped("Task Group","value"),"priority_distribution":grouped("Priority","value"),"overdue_by_project":records(x[x.OverDue].groupby("project").size().reset_index(name="value")),"completion_by_project":records(completed),"safety_by_project":records(x[safety].groupby("project").size().reset_index(name="value")),"forms_by_project":records(forms.groupby("Project").size().reset_index(name="value"))},"task_records":records(x)}

def detail(project_id):
    tasks,_,_=datasets()
    from ..core.users import _connect
    with _connect() as db:
        proj = db.execute("SELECT id, name, status, priority, deadline FROM projects WHERE id = ?", (project_id,)).fetchone()
    if not proj: return None
    x=tasks[tasks.project.astype(str)==str(project_id)]
    if x.empty:
        return {"project":str(project_id),"name":proj["name"],"status":proj["status"],"priority":proj["priority"],"deadline":proj["deadline"],"tasks":[],"breakdowns":{"task_group":[],"priority":[],"cause":[],"status":[]}}
    return {"project":str(project_id),"name":proj["name"],"status":proj["status"],"priority":proj["priority"],"deadline":proj["deadline"],"tasks":records(x),"breakdowns":{"task_group":records(x.groupby("Task Group").size().reset_index(name="value")),"priority":records(x.groupby("Priority").size().reset_index(name="value")),"cause":records(x.groupby("Cause").size().reset_index(name="value")),"status":records(x.groupby("Status").size().reset_index(name="value"))}}
