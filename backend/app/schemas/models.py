from pydantic import BaseModel, Field
from typing import Optional

class LoginRequest(BaseModel): username: str; password: str
class ResourceRequest(BaseModel):
    department: str; role_level: str; estimated_weekly_workload: float = Field(ge=0, le=40); minimum_performance_rating: float = Field(ge=0)
class WhatIfRequest(BaseModel): employee_id: str
class AttritionRequest(BaseModel):
    department: str; role_level: str; monthly_salary: float = Field(ge=0); avg_weekly_hours: float = Field(ge=0); projects_handled: float = Field(ge=0); performance_rating: float = Field(ge=0); absences_days: float = Field(ge=0); job_satisfaction: float = Field(ge=0)
