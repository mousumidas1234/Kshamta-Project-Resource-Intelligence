from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from ..core.auth import demo_login, login, require
from ..core.users import _connect, hash_password, list_users, public_user, find, ROLES
from ..schemas.models import LoginRequest, DemoLoginRequest, ResourceRequest, WhatIfRequest, AttritionRequest, UserCreate, UserUpdate, PasswordReset
from ..services import project_service, risk_service, workforce_service, resource_service, attrition_service
from ..services.data_service import datasets

router=APIRouter(prefix="/api")
@router.post("/auth/login")
def auth(body: LoginRequest):
    token,user=login(body.username,body.password); return {"access_token":token,"token_type":"bearer","user":{"username":user["sub"],"role":find(user["user_id"])["role"]}}
@router.post("/auth/demo")
def demo_auth(body: DemoLoginRequest):
    token,user=demo_login(body.role); return {"access_token":token,"token_type":"bearer","user":{"username":user["sub"],"role":user["role"],"demo":True}}
@router.get("/users")
def users(user=Depends(require("user_management"))): return list_users()
@router.post("/users", status_code=201)
def create_user(body: UserCreate, user=Depends(require("user_management_write"))):
    if body.password != body.confirm_password: raise HTTPException(400, "Passwords do not match")
    if body.role not in ROLES: raise HTTPException(400, "Invalid role")
    if body.status not in ("Active", "Inactive"): raise HTTPException(400, "Invalid status")
    now = datetime.now(timezone.utc).isoformat()
    try:
        with _connect() as db:
            cursor = db.execute("INSERT INTO users(full_name, username, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                (body.full_name.strip(), body.username.strip(), hash_password(body.password), body.role, body.status == "Active", now, now))
            row = db.execute("SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)).fetchone()
    except Exception as exc:
        if "UNIQUE" in str(exc).upper(): raise HTTPException(409, "Username is already in use")
        raise
    return public_user(row)
@router.put("/users/{user_id}")
def update_user(user_id: int, body: UserUpdate, user=Depends(require("user_management_write"))):
    target = find(user_id)
    if not target: raise HTTPException(404, "User not found")
    if body.role not in ROLES: raise HTTPException(400, "Invalid role")
    if body.status not in ("Active", "Inactive"): raise HTTPException(400, "Invalid status")
    if target["role"] == "Admin" and (body.role != "Admin" or body.status != "Active"):
        with _connect() as db:
            if db.execute("SELECT COUNT(*) FROM users WHERE role = 'Admin' AND is_active = 1").fetchone()[0] <= 1:
                raise HTTPException(400, "The final active Admin cannot be deactivated or changed")
    now = datetime.now(timezone.utc).isoformat()
    try:
        with _connect() as db:
            db.execute("UPDATE users SET full_name=?, username=?, role=?, is_active=?, updated_at=? WHERE id=?",
                       (body.full_name.strip(), body.username.strip(), body.role, body.status == "Active", now, user_id))
            row = db.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
    except Exception as exc:
        if "UNIQUE" in str(exc).upper(): raise HTTPException(409, "Username is already in use")
        raise
    return public_user(row)
@router.post("/users/{user_id}/reset-password")
def reset_password(user_id: int, body: PasswordReset, user=Depends(require("user_management_write"))):
    if body.new_password != body.confirm_password: raise HTTPException(400, "Passwords do not match")
    if not find(user_id): raise HTTPException(404, "User not found")
    with _connect() as db: db.execute("UPDATE users SET password_hash=?, updated_at=? WHERE id=?", (hash_password(body.new_password), datetime.now(timezone.utc).isoformat(), user_id))
    return {"message": "Password reset successfully."}
@router.delete("/users/{user_id}")
def delete_user(user_id: int, user=Depends(require("user_management_write"))):
    target = find(user_id)
    if not target: raise HTTPException(404, "User not found")
    if target["id"] == user["user_id"]: raise HTTPException(400, "You cannot delete your own account")
    with _connect() as db:
        if target["role"] == "Admin" and db.execute("SELECT COUNT(*) FROM users WHERE role='Admin'").fetchone()[0] <= 1:
            raise HTTPException(400, "The final Admin account cannot be deleted")
        db.execute("DELETE FROM users WHERE id=?", (user_id,))
    return {"message": "User deleted successfully."}
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
