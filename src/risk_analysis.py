import numpy as np
import pandas as pd

def add_risk(summary: pd.DataFrame) -> pd.DataFrame:
    out=summary.copy(); total=out["Total Tasks"].replace(0,np.nan)
    components={"Overdue":35*out["Overdue Tasks"]/total,"Open":25*out["Open Tasks"]/total,"High priority":25*out["High Priority Tasks"]/total,"Safety":15*out["Safety Tasks"]/total}
    out["Risk Score"]=sum(components.values()).fillna(0).clip(0,100).round(1)
    out["Risk Category"]=pd.cut(out["Risk Score"],[-1,29,59,100],labels=["Low","Medium","High"]).astype(str)
    component_frame=pd.DataFrame(components)
    out["Main Risk Contributor"]=component_frame.idxmax(axis=1).map({"Overdue":"High overdue rate","Open":"Open/incomplete task rate","High priority":"High-priority task rate","Safety":"Safety issue rate"})
    out["Risk Explanation"]=out["Main Risk Contributor"]+" is the main contributor to this derived score."
    return out.sort_values("Risk Score",ascending=False).reset_index(drop=True)
