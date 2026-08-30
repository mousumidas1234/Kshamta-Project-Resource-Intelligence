from pydantic import BaseModel, Field
from typing import Optional

class LoginRequest(BaseModel): username: str; password: str
class DemoLoginRequest(BaseModel): role: str
class UserCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=120)
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=8, max_length=256)
    confirm_password: str
    role: str
    employee_id: Optional[int] = None
    status: str
class UserUpdate(BaseModel):
    full_name: str = Field(min_length=1, max_length=120)
    username: str = Field(min_length=1, max_length=80)
    role: str
    employee_id: Optional[int] = None
    status: str
class PasswordReset(BaseModel):
    new_password: str = Field(min_length=8, max_length=256)
    confirm_password: str
class ResourceRequest(BaseModel):
    department: str; role_level: str; estimated_weekly_workload: float = Field(ge=0, le=40); minimum_performance_rating: float = Field(ge=0)
class WhatIfRequest(BaseModel): employee_id: str
class AttritionRequest(BaseModel):
    department: str; role_level: str; monthly_salary: float = Field(ge=0); avg_weekly_hours: float = Field(ge=0); projects_handled: float = Field(ge=0); performance_rating: float = Field(ge=0); absences_days: float = Field(ge=0); job_satisfaction: float = Field(ge=0)

class ProjectCreate(BaseModel):
    id: str
    name: str
    status: str = "Active"
    priority: str = "Medium"
    deadline: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: str
    status: str
    priority: str
    deadline: Optional[str] = None

class TaskCreateOrUpdate(BaseModel):
    Ref: str
    Status: str
    Location: str
    Description: str
    Created: str
    Target: Optional[str] = None
    Type: str
    To_Package: str = Field(alias="To Package")
    Status_Changed: Optional[str] = Field(None, alias="Status Changed")
    Association: str
    OverDue: bool
    Priority: str
    Cause: str
    project: str
    Report_Status: str = Field(alias="Report Status")
    Task_Group: str = Field(alias="Task Group")
    estimated_hours: float = 8.0

    model_config = {"populate_by_name": True}

class EmployeeCreateOrUpdate(BaseModel):
    department: str
    role_level: str
    monthly_salary: float
    avg_weekly_hours: float
    projects_handled: int
    performance_rating: float
    absences_days: int
    job_satisfaction: int
    attrition: str
    skills: str = ""
    capacity: float = 40.0
    availability: str = "Available"
    employment_status: str = "Full-Time"

class AssignmentRequest(BaseModel):
    employee_id: int
    assigned_hours: Optional[float] = None

class TaskStatusUpdate(BaseModel):
    status: str = Field(min_length=1, max_length=80)

class AssistantChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1200)
