from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from src.data_loader import load_data
from src.employee_features import employee_frame
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score,precision_score,recall_score,f1_score,roc_auc_score
import joblib

FEATURES=["department","role_level","monthly_salary","avg_weekly_hours","projects_handled","performance_rating","absences_days","job_satisfaction"]
def train():
    _,_,raw=load_data(); e=employee_frame(raw); X=e[FEATURES]; y=e.attrition_flag.astype(int)
    Xtr,Xte,ytr,yte=train_test_split(X,y,test_size=.2,random_state=42,stratify=y if y.nunique()>1 else None)
    prep=ColumnTransformer([("cat",Pipeline([("impute",SimpleImputer(strategy="most_frequent")),("onehot",OneHotEncoder(handle_unknown="ignore"))]),FEATURES[:2]),("num",Pipeline([("impute",SimpleImputer(strategy="median"))]),FEATURES[2:])])
    models={"Logistic Regression":LogisticRegression(max_iter=1000,random_state=42),"Random Forest":RandomForestClassifier(n_estimators=200,random_state=42,class_weight="balanced")}
    results={}; fitted={}
    for name,est in models.items():
        pipe=Pipeline([("prep",prep),("model",est)]); pipe.fit(Xtr,ytr); pred=pipe.predict(Xte); proba=pipe.predict_proba(Xte)[:,1]
        results[name]={"accuracy":accuracy_score(yte,pred),"precision":precision_score(yte,pred,zero_division=0),"recall":recall_score(yte,pred,zero_division=0),"f1":f1_score(yte,pred,zero_division=0),"roc_auc":roc_auc_score(yte,proba) if yte.nunique()>1 else None}; fitted[name]=pipe
    best=max(results,key=lambda n: results[n]["roc_auc"] if results[n]["roc_auc"] is not None else results[n]["f1"])
    model_path = Path(__file__).resolve().parents[1] / "models" / "attrition_model.joblib"
    model_path.parent.mkdir(exist_ok=True); joblib.dump({"model":fitted[best],"selected_model":best,"metrics":results,"features":FEATURES},model_path)
    return results,best
if __name__=="__main__":
    metrics,best=train(); print("Selected model:",best)
    for name,values in metrics.items(): print(name,{k:None if v is None else round(v,4) for k,v in values.items()})
