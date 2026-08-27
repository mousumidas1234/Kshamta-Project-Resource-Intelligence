import pandas as pd

def _open(series): return ~series.astype(str).str.lower().isin(["closed", "complete", "completed"])
def _safety(frame):
    return frame.get("Task Group", pd.Series("", index=frame.index)).astype(str).str.contains("safety", case=False, na=False) | frame.get("Type", pd.Series("", index=frame.index)).astype(str).str.contains("safety", case=False, na=False)

def project_summary(tasks: pd.DataFrame, forms: pd.DataFrame) -> pd.DataFrame:
    t = tasks.copy(); t["project"] = t["project"].fillna("Unknown").astype(str)
    t["is_open"], t["is_high"], t["is_safety"] = _open(t["Status"]), t.get("Priority", "").astype(str).str.contains("high|urgent|critical", case=False, regex=True, na=False), _safety(t)
    base = t.groupby("project", dropna=False).agg(**{"Total Tasks":("project","size"),"Open Tasks":("is_open","sum"),"Overdue Tasks":("OverDue","sum"),"High Priority Tasks":("is_high","sum"),"Safety Tasks":("is_safety","sum")}).reset_index()
    base["Closed Tasks"] = base["Total Tasks"] - base["Open Tasks"]
    base["Completion Rate"] = (100 * base["Closed Tasks"] / base["Total Tasks"]).round(1)
    if not forms.empty and "Project" in forms:
        f=forms.copy(); f["Project"]=f["Project"].fillna("Unknown").astype(str); f["open_actions"]=pd.to_numeric(f.get("Open Actions",0),errors="coerce").fillna(0); f["total_actions"]=pd.to_numeric(f.get("Total Actions",0),errors="coerce").fillna(0)
        fg=f.groupby("Project").agg(**{"Total Forms":("Project","size"),"Open Actions":("open_actions","sum"),"Total Actions":("total_actions","sum")}).reset_index().rename(columns={"Project":"project"})
        base=base.merge(fg,on="project",how="left")
    for col in ["Total Forms","Open Actions","Total Actions"]:
        if col not in base: base[col]=0
        base[col]=base[col].fillna(0).astype(int)
    return base
