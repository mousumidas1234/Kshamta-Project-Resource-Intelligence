import sqlite3
import pandas as pd
from pathlib import Path
from .config import USERS_DB_PATH, DATA_DIR

def initialize_db():
    conn = sqlite3.connect(USERS_DB_PATH)
    # Enforce the declared assignment cascades for every connection used during
    # initialization; seed steps remain append-only and only run on empty tables.
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    
    # 1. Create employees table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employees (
        employee_id INTEGER PRIMARY KEY,
        department TEXT,
        role_level TEXT,
        monthly_salary REAL,
        avg_weekly_hours REAL,
        projects_handled INTEGER,
        performance_rating REAL,
        absences_days INTEGER,
        job_satisfaction INTEGER,
        attrition TEXT,
        skills TEXT DEFAULT '',
        capacity REAL DEFAULT 40.0,
        availability TEXT DEFAULT 'Available',
        employment_status TEXT DEFAULT 'Full-Time'
    )""")
    
    # 2. Create projects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT,
        status TEXT DEFAULT 'Active',
        priority TEXT DEFAULT 'Medium',
        deadline TEXT
    )""")
    
    # 3. Create tasks table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        "Ref" TEXT,
        "Status" TEXT,
        "Location" TEXT,
        "Description" TEXT,
        "Created" TEXT,
        "Target" TEXT,
        "Type" TEXT,
        "To Package" TEXT,
        "Status Changed" TEXT,
        "Association" TEXT,
        "OverDue" INTEGER,
        "Images" TEXT,
        "Comments" TEXT,
        "Documents" TEXT,
        "Priority" TEXT,
        "Cause" TEXT,
        "project" TEXT,
        "Report Status" TEXT,
        "Task Group" TEXT,
        "estimated_hours" REAL DEFAULT 8.0,
        FOREIGN KEY(project) REFERENCES projects(id) ON DELETE SET NULL
    )""")
    
    # 4. Create forms table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS forms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        "Ref" TEXT,
        "Status" TEXT,
        "Location" TEXT,
        "Name" TEXT,
        "Created" TEXT,
        "Type" TEXT,
        "Status Changed" TEXT,
        "Open Actions" INTEGER,
        "Total Actions" INTEGER,
        "Association" TEXT,
        "OverDue" INTEGER,
        "Images" TEXT,
        "Comments" TEXT,
        "Documents" TEXT,
        "Project" TEXT,
        "Report Forms Status" TEXT,
        "Report Forms Group" TEXT,
        FOREIGN KEY(Project) REFERENCES projects(id) ON DELETE SET NULL
    )""")
    
    # 5. Create project_assignments table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS project_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT NOT NULL,
        employee_id INTEGER NOT NULL,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
        UNIQUE(project_id, employee_id)
    )""")

    # 6. Create task_assignments table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS task_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        assigned_hours REAL,
        FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
        UNIQUE(task_id, employee_id)
    )""")
    
    conn.commit()
    
    # Seed data if tables are empty
    # check if employees table is empty
    cursor.execute("SELECT COUNT(*) FROM employees")
    if cursor.fetchone()[0] == 0:
        df_emp = pd.read_csv(DATA_DIR / "employees_clean.csv")
        # Add new columns with default values if not present
        df_emp['skills'] = ''
        df_emp['capacity'] = 40.0
        df_emp['availability'] = 'Available'
        df_emp['employment_status'] = 'Full-Time'
        df_emp.to_sql('employees', conn, if_exists='append', index=False)
        
    # check if projects table is empty
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        df_tasks = pd.read_csv(DATA_DIR / "tasks_clean.csv")
        df_forms = pd.read_csv(DATA_DIR / "forms_clean.csv")
        p_tasks = df_tasks['project'].dropna().unique()
        p_forms = df_forms['Project'].dropna().unique()
        unique_projects = list(set(p_tasks) | set(p_forms))
        df_proj = pd.DataFrame({
            'id': unique_projects,
            'name': [f"Project {p}" for p in unique_projects],
            'status': 'Active',
            'priority': 'Medium',
            'deadline': None
        })
        df_proj.to_sql('projects', conn, if_exists='append', index=False)
        
    # check if tasks table is empty
    cursor.execute("SELECT COUNT(*) FROM tasks")
    if cursor.fetchone()[0] == 0:
        df_tasks = pd.read_csv(DATA_DIR / "tasks_clean.csv")
        # OverDue needs to be converted to integer 0/1 for sqlite
        df_tasks['OverDue'] = df_tasks['OverDue'].astype(int)
        df_tasks['estimated_hours'] = 8.0
        df_tasks.to_sql('tasks', conn, if_exists='append', index=False)
        
    # check if forms table is empty
    cursor.execute("SELECT COUNT(*) FROM forms")
    if cursor.fetchone()[0] == 0:
        df_forms = pd.read_csv(DATA_DIR / "forms_clean.csv")
        df_forms['OverDue'] = df_forms['OverDue'].astype(int)
        df_forms.to_sql('forms', conn, if_exists='append', index=False)
        
    conn.commit()
    conn.close()
