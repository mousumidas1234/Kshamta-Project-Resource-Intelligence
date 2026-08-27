import pandas as pd
from .project_service import summary
from .data_service import records

def risks():
    out=summary().copy(); total=out.total_tasks.replace(0,1)
    components=pd.DataFrame({"Overdue rate":35*out.overdue_tasks/total,"Open/incomplete task rate":25*out.open_tasks/total,"High-priority task rate":25*out.high_priority_tasks/total,"Safety issue rate":15*out.safety_tasks/total})
    out["risk_score"]=components.sum(axis=1).clip(0,100).round(1)
    out["risk_category"]=pd.cut(out.risk_score,[-1,29,59,100],labels=["Low","Medium","High"]).astype(str)
    out["primary_risk_contributor"]=components.idxmax(axis=1)
    out["risk_explanation"]=out.primary_risk_contributor+" contributes most to the current derived risk score."
    return records(out.sort_values("risk_score",ascending=False))
