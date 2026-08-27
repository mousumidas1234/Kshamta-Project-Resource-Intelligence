import sys
from pathlib import Path
import pandas as pd
import plotly.express as px
import streamlit as st

sys.path.insert(0, str(Path(__file__).parent))
from src.auth import login, allowed, PERMISSIONS
from src.data_loader import load_data
from src.project_features import project_summary
from src.risk_analysis import add_risk
from src.employee_features import employee_frame, workforce_kpis
from src.resource_recommendation import recommend
from src.model_utils import load_model, risk_category

ALL_PAGES = ["Dashboard", "Project Analytics", "Project Risk Intelligence", "Workforce Analytics", "Simulated Resource Recommendation", "What-If Resource Simulation", "Attrition Prediction", "Project Details", "Employee Details"]

st.set_page_config(page_title="KSHAMTA | Project Intelligence", page_icon="K", layout="wide")

@st.cache_data
def data():
    return load_data()

@st.cache_data
def risk_data():
    tasks, forms, _ = data()
    return add_risk(project_summary(tasks, forms))

def chart(fig):
    fig.update_layout(template="plotly_white", margin=dict(l=20, r=20, t=55, b=20))
    st.plotly_chart(fig, use_container_width=True)

def kpis(values):
    for col, (label, value) in zip(st.columns(len(values)), values.items()):
        col.metric(label, value)

def title(page):
    st.title(page)
    st.caption("KSHAMTA — Project Intelligence & Resource Analytics Platform")

def dashboard(tasks, forms, employees):
    title("KSHAMTA")
    risk = risk_data(); wk = workforce_kpis(employees)
    values = {"Total Projects": risk.project.nunique(), "Total Tasks": len(tasks), "Total Forms": len(forms), "Open Tasks": int(risk["Open Tasks"].sum()), "Overdue Tasks": int(risk["Overdue Tasks"].sum()), "Completion Rate": f"{risk['Closed Tasks'].sum()/risk['Total Tasks'].sum()*100:.1f}%", "Average Project Risk": f"{risk['Risk Score'].mean():.1f}"}
    if allowed("Workforce Analytics"):
        values.update({"Employees": wk["Total Employees"], "Attrition Rate": f"{wk['Attrition Rate']:.1f}%"})
    kpis(values)
    st.subheader("Project health")
    kpis({f"{x} Risk Projects": int((risk["Risk Category"] == x).sum()) for x in ["Low", "Medium", "High"]})
    st.subheader("Top project risks")
    st.dataframe(risk[["project", "Risk Score", "Risk Category", "Completion Rate", "Overdue Tasks", "Main Risk Contributor"]].head(10), use_container_width=True, hide_index=True)
    c1, c2 = st.columns(2)
    with c1: chart(px.bar(tasks.groupby("Status").size().reset_index(name="Tasks"), x="Status", y="Tasks", title="Tasks by status"))
    with c2: chart(px.bar(risk.head(15), x="project", y="Risk Score", color="Risk Category", title="Highest project risk scores"))
    if allowed("Workforce Analytics"):
        e = employee_frame(employees); st.subheader("Workforce overview")
        c1, c2 = st.columns(2)
        with c1: chart(px.bar(e.groupby("department").size().reset_index(name="Employees"), x="department", y="Employees", title="Employees by department"))
        with c2: chart(px.histogram(e, x="avg_weekly_hours", nbins=20, title="Weekly hours distribution"))
        high = risk.iloc[0]; largest = e.department.value_counts().idxmax(); attr = e.groupby("department").attrition_flag.mean().idxmax()
        st.info(f"Key insights: **{high.project}** has the highest derived project risk ({high['Risk Score']:.1f}); **{largest}** is the largest department; **{attr}** has the highest observed attrition rate. Observations do not establish causality.")

def project_analytics(tasks, forms):
    title("Project Analytics")
    a,b,c,d = st.columns(4)
    ps=a.multiselect("Project", sorted(tasks.project.dropna().astype(str).unique())); gs=b.multiselect("Task group", sorted(tasks["Task Group"].dropna().astype(str).unique())); ss=c.multiselect("Status", sorted(tasks.Status.dropna().astype(str).unique())); prs=d.multiselect("Priority", sorted(tasks.Priority.dropna().astype(str).unique()))
    valid_dates = tasks["Created"].dropna()
    date_range = st.date_input("Created date range", value=(valid_dates.min().date(), valid_dates.max().date())) if not valid_dates.empty else None
    x=tasks.copy(); x.project=x.project.astype(str)
    for col, selected in [("project",ps),("Task Group",gs),("Status",ss),("Priority",prs)]:
        if selected: x=x[x[col].astype(str).isin(selected)]
    if date_range and len(date_range) == 2:
        x=x[(x.Created.dt.date >= date_range[0]) & (x.Created.dt.date <= date_range[1])]
    if x.empty: st.warning("No tasks match these filters."); return
    open_mask=~x.Status.astype(str).str.lower().isin(["closed","complete","completed"]); safety=x["Task Group"].astype(str).str.contains("safety",case=False)|x.Type.astype(str).str.contains("safety",case=False); high=x.Priority.astype(str).str.contains("high|urgent|critical",case=False,regex=True)
    kpis({"Total Tasks":len(x),"Open Tasks":int(open_mask.sum()),"Closed Tasks":int((~open_mask).sum()),"Overdue Tasks":int(x.OverDue.sum()),"Completion Rate":f"{(~open_mask).mean()*100:.1f}%","Safety Tasks":int(safety.sum()),"High Priority Tasks":int(high.sum()),"Total Forms":len(forms)})
    c1,c2=st.columns(2)
    with c1: chart(px.bar(x.groupby("project").size().reset_index(name="Tasks"),x="project",y="Tasks",title="Tasks by project"))
    with c2: chart(px.bar(x.groupby("Task Group").size().reset_index(name="Tasks").sort_values("Tasks",ascending=False).head(20),x="Task Group",y="Tasks",title="Tasks by task group"))
    c1,c2=st.columns(2)
    with c1: chart(px.pie(x,names="Priority",title="Priority distribution"))
    with c2: chart(px.bar(x[x.OverDue].groupby("project").size().reset_index(name="Overdue"),x="project",y="Overdue",title="Overdue tasks by project"))

def project_risk():
    title("Project Risk Intelligence")
    st.info("KSHAMTA Project Risk Score is a derived analytical metric, not an official source-dataset score. Score = overdue rate × 35 + open rate × 25 + high-priority rate × 25 + safety rate × 15.")
    st.dataframe(risk_data(),use_container_width=True,hide_index=True)

def workforce(employees):
    title("Workforce Analytics"); e=employee_frame(employees); wk=workforce_kpis(e)
    kpis({k:(f"{v:.1f}%" if k=="Attrition Rate" else f"{v:.1f}" if isinstance(v,float) else v) for k,v in wk.items()})
    c1,c2=st.columns(2)
    with c1: chart(px.bar(e.groupby("department").size().reset_index(name="Employees"),x="department",y="Employees",title="Employees by department"))
    with c2: chart(px.bar(e.groupby("role_level").size().reset_index(name="Employees"),x="role_level",y="Employees",title="Employees by role level"))
    c1,c2,c3=st.columns(3)
    with c1: chart(px.histogram(e,x="avg_weekly_hours",title="Weekly hours"))
    with c2: chart(px.histogram(e,x="projects_handled",title="Projects handled"))
    with c3: chart(px.histogram(e,x="job_satisfaction",title="Job satisfaction"))
    st.caption("All attrition comparisons show observed relationships in this dataset; they do not demonstrate causation.")
    chart(px.bar(e.groupby("department").attrition_flag.mean().mul(100).reset_index(name="Observed Attrition %"),x="department",y="Observed Attrition %",title="Observed attrition by department"))

def resource_page(employees):
    title("Simulated Resource Recommendation")
    st.info("This is hypothetical and is not a historical employee-project assignment. 40 hours/week is an assumed baseline for recommendation purposes.")
    e=employee_frame(employees); c1,c2,c3,c4=st.columns(4); dep=c1.selectbox("Required Department",sorted(e.department.unique())); role=c2.selectbox("Required Role Level",sorted(e.role_level.unique())); work=c3.number_input("Estimated Weekly Workload",0.0,40.0,8.0); perf=c4.number_input("Minimum Performance Rating",float(e.performance_rating.min()),float(e.performance_rating.max()),float(e.performance_rating.median()))
    rec=recommend(e,dep,role,work,perf); st.caption("Score (0–100): department 25, role 20, performance 15, estimated capacity 20, projects handled 10, absences 5, job satisfaction 5.")
    st.dataframe(rec[["employee_id","department","role_level","avg_weekly_hours","projects_handled","performance_rating","absences_days","job_satisfaction","Suitability Score","Recommendation","Explanation"]].head(30),use_container_width=True,hide_index=True)

def what_if(employees):
    title("What-If Resource Simulation")
    st.info("Hypothetical simulation based on employee workload characteristics. It does not state or infer any historical project assignment.")
    e=employee_frame(employees); selected=st.selectbox("Select employee",e.employee_id.astype(str)); person=e[e.employee_id.astype(str)==selected].iloc[0]; reduction=min(40,float(person.avg_weekly_hours)); impact="High" if reduction>=35 else "Medium" if reduction>=20 else "Low"
    kpis({"Selected Employee":selected,"Current Weekly Hours":f"{person.avg_weekly_hours:.1f}","Current Projects Handled":f"{person.projects_handled:.0f}","Simulated Capacity Reduction":f"{reduction:.1f} hours/week","Workload Impact":impact,"Risk Level":impact})
    replacements=recommend(e[e.employee_id.astype(str)!=selected],person.department,person.role_level,min(reduction,40),person.performance_rating).head(10)
    st.subheader("Recommended replacement employees (simulated)"); st.dataframe(replacements[["employee_id","department","role_level","Suitability Score","Recommendation","Explanation"]],hide_index=True,use_container_width=True)

def attrition_page(employees):
    title("Attrition Prediction"); bundle=load_model()
    if not bundle: st.warning("No trained model found. Run `python3 src/train_model.py` first."); return
    st.caption(f"Selected model: {bundle['selected_model']}. Low < 34%, Medium 34–66%, High ≥ 67%.")
    st.subheader("Actual held-out model evaluation")
    st.dataframe(pd.DataFrame(bundle["metrics"]).T.rename(columns={"roc_auc":"ROC-AUC", "f1":"F1", "accuracy":"Accuracy", "precision":"Precision", "recall":"Recall"}).round(3), use_container_width=True)
    e=employee_frame(employees)
    c1,c2,c3,c4=st.columns(4); dep=c1.selectbox("Department",sorted(e.department.unique())); role=c2.selectbox("Role Level",sorted(e.role_level.unique())); salary=c3.number_input("Monthly Salary",value=float(e.monthly_salary.median())); hours=c4.number_input("Weekly Hours",value=float(e.avg_weekly_hours.median()))
    c1,c2,c3,c4=st.columns(4); projects=c1.number_input("Projects Handled",value=float(e.projects_handled.median())); performance=c2.number_input("Performance Rating",value=float(e.performance_rating.median())); absence=c3.number_input("Absence Days",value=float(e.absences_days.median())); satisfaction=c4.number_input("Job Satisfaction",value=float(e.job_satisfaction.median()))
    row=pd.DataFrame([[dep,role,salary,hours,projects,performance,absence,satisfaction]],columns=bundle['features']); p=float(bundle['model'].predict_proba(row)[0,1]); st.metric("Predicted Attrition Probability",f"{p:.1%}"); st.write("Risk Category:",risk_category(p)); st.info("The prediction is a statistical estimate and is not a guarantee that an employee will leave.")

def project_details(tasks):
    title("Project Details"); r=risk_data(); project=st.selectbox("Project",r.project); row=r[r.project==project].iloc[0]
    kpis({k:row[k] for k in ["Total Tasks","Closed Tasks","Open Tasks","Overdue Tasks","Completion Rate","Safety Tasks","High Priority Tasks","Risk Score","Risk Category"]}); x=tasks[tasks.project.astype(str)==str(project)]
    c1,c2=st.columns(2)
    with c1: chart(px.bar(x.groupby("Task Group").size().reset_index(name="Tasks"),x="Task Group",y="Tasks",title="Task group breakdown"))
    with c2: chart(px.bar(x.groupby("Priority").size().reset_index(name="Tasks"),x="Priority",y="Tasks",title="Priority breakdown"))
    st.dataframe(x,use_container_width=True,hide_index=True)

def employee_details(employees):
    title("Employee Details"); e=employee_frame(employees); emp=st.selectbox("Employee ID",e.employee_id.astype(str)); row=e[e.employee_id.astype(str)==emp].iloc[0]
    kpis({"Employee ID":emp,"Department":row.department,"Role Level":row.role_level,"Monthly Salary":f"{row.monthly_salary:.0f}","Weekly Hours":f"{row.avg_weekly_hours:.1f}","Projects Handled":row.projects_handled,"Performance":row.performance_rating,"Absence Days":row.absences_days,"Job Satisfaction":row.job_satisfaction,"Actual Attrition":row.attrition}); bundle=load_model()
    if bundle:
        p=float(bundle['model'].predict_proba(pd.DataFrame([row[bundle['features']].to_dict()]))[0,1]); st.metric("Predicted Attrition Probability",f"{p:.1%}"); st.write("Predicted Risk Category:",risk_category(p))

def main():
    if not st.session_state.get("authenticated"): login(); return
    tasks,forms,employees=data(); pages=[p for p in ALL_PAGES if p in PERMISSIONS[st.session_state.role]]
    with st.sidebar:
        st.header("KSHAMTA"); st.caption("Project Intelligence & Resource Analytics Platform"); st.write(f"**{st.session_state.username}** — {st.session_state.role}"); page=st.radio("Navigation",pages)
        if st.button("Logout"): st.session_state.clear(); st.rerun()
    if not allowed(page): st.error("Unauthorized."); return
    {"Dashboard":lambda:dashboard(tasks,forms,employees),"Project Analytics":lambda:project_analytics(tasks,forms),"Project Risk Intelligence":project_risk,"Workforce Analytics":lambda:workforce(employees),"Simulated Resource Recommendation":lambda:resource_page(employees),"What-If Resource Simulation":lambda:what_if(employees),"Attrition Prediction":lambda:attrition_page(employees),"Project Details":lambda:project_details(tasks),"Employee Details":lambda:employee_details(employees)}[page]()

if __name__=="__main__": main()
