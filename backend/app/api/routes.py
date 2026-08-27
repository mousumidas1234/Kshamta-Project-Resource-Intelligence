from fastapi import APIRouter, Depends, HTTPException, Query
from ..core.auth import login, require
from ..schemas.models import LoginRequest, ResourceRequest, WhatIfRequest, AttritionRequest
from ..services import project_service, risk_service, workforce_service, resource_service, attrition_service
from ..services.data_service import datasets

router=APIRouter(prefix="/api")
@router.post("/auth/login")
def auth(body: LoginRequest):
    token,user=login(body.username,body.password); return {"access_token":token,"token_type":"bearer","user":{"username":user["sub"],"role":user["role"]}}
@router.get("/dashboard/overview")
def dashboard(user=Depends(require("dashboard"))):
    tasks,forms,employees=datasets(); risk=risk_service.risks(); workforce=workforce_service.overview(); return {"metrics":{"total_projects":len(risk),"total_tasks":len(tasks),"total_forms":len(forms),"open_tasks":sum(x["open_tasks"] for x in risk),"overdue_tasks":sum(x["overdue_tasks"] for x in risk),"completion_rate":round(sum(x["closed_tasks"] for x in risk)/len(tasks)*100,1),"average_project_risk":round(sum(x["risk_score"] for x in risk)/len(risk),1),"total_employees":len(employees),"employee_attrition_rate":workforce["metrics"]["attrition_rate"]},"top_risks":risk[:8],"project_charts":project_service.analytics()["charts"],"workforce_charts":workforce["charts"]}
@router.get("/projects")
def projects(user=Depends(require("projects"))): return project_service.summary().to_dict(orient="records")
@router.get("/projects/analytics")
def project_analytics(project: str|None=None, task_group: str|None=None, status: str|None=None, priority: str|None=None, start: str|None=None, end: str|None=None, user=Depends(require("projects"))): return project_service.analytics(project,task_group,status,priority,start,end)
@router.get("/projects/risk")
def risk(user=Depends(require("risk"))): return {"disclaimer":"Derived KSHAMTA Project Risk Score — an analytical metric created for this application, not an official source-dataset score.","projects":risk_service.risks()}
@router.get("/projects/{project_id}")
def project(project_id: str,user=Depends(require("projects"))):
    value=project_service.detail(project_id)
    if not value: raise HTTPException(404,"Project not found")
    value["metrics"] = next((item for item in risk_service.risks() if str(item["project"]) == str(project_id)), None)
    return value
@router.get("/workforce/overview")
def workforce(user=Depends(require("workforce"))): return workforce_service.overview()
@router.get("/employees")
def employees(user=Depends(require("employees"))): return workforce_service.employees()
@router.get("/employees/{employee_id}")
def employee(employee_id: str,user=Depends(require("employees"))):
    value=workforce_service.employee(employee_id)
    if not value: raise HTTPException(404,"Employee not found")
    try: value["prediction"]=attrition_service.predict(value)
    except FileNotFoundError: pass
    return value
@router.post("/resources/recommend")
def resources(body:ResourceRequest,user=Depends(require("resources"))): return {"disclaimer":"40 hours/week is an assumed baseline for recommendation purposes. Results are simulated employee-characteristic recommendations, not historical project assignments.","recommendations":resource_service.recommend(body.department,body.role_level,body.estimated_weekly_workload,body.minimum_performance_rating)[:100]}
@router.post("/resources/what-if")
def whatif(body:WhatIfRequest,user=Depends(require("resources"))):
    value=resource_service.what_if(body.employee_id)
    if not value: raise HTTPException(404,"Employee not found")
    value["disclaimer"]="Simulation only — this does not represent a historical employee-project assignment."
    return value
@router.get("/attrition/model-metrics")
def model_metrics(user=Depends(require("attrition"))): return attrition_service.metrics()
@router.post("/attrition/predict")
def attrition(body:AttritionRequest,user=Depends(require("attrition"))): return attrition_service.predict(body.model_dump())
