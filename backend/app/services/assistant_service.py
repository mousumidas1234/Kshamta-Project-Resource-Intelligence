"""Read-only, role-scoped assistant context from the live application data."""
from datetime import date

from ..core.users import _connect
from . import risk_service
from .workforce_service import frame


def _is_open(status):
    return str(status or "").lower() not in {"closed", "complete", "completed"}


def _my_work(user):
    employee_id = user.get("employee_id")
    if not employee_id:
        return {"employee": None, "projects": [], "tasks": []}
    with _connect() as db:
        employee = db.execute("SELECT * FROM employees WHERE employee_id=?", (employee_id,)).fetchone()
        tasks = db.execute("""SELECT t.id, t.Ref, t.Status, t.Description, t.Priority, t.project,
            t.OverDue, t.Target, ta.assigned_hours FROM task_assignments ta
            JOIN tasks t ON t.id=ta.task_id WHERE ta.employee_id=? ORDER BY t.Status, t.id""", (employee_id,)).fetchall()
        projects = db.execute("""SELECT p.id, p.name, p.status, p.priority, p.deadline
            FROM project_assignments pa JOIN projects p ON p.id=pa.project_id
            WHERE pa.employee_id=? ORDER BY p.name""", (employee_id,)).fetchall()
    return {"employee": dict(employee) if employee else None,
            "projects": [dict(row) for row in projects],
            "tasks": [dict(row) for row in tasks]}


def _project_rows():
    with _connect() as db:
        rows = db.execute("""SELECT p.id, p.name, p.status, p.priority, p.deadline,
            COUNT(t.id) AS total_tasks,
            SUM(CASE WHEN t.id IS NOT NULL AND lower(COALESCE(t.Status,'')) NOT IN ('closed','complete','completed') THEN 1 ELSE 0 END) AS open_tasks,
            SUM(CASE WHEN t.OverDue = 1 THEN 1 ELSE 0 END) AS overdue_tasks
            FROM projects p LEFT JOIN tasks t ON t.project=p.id GROUP BY p.id ORDER BY p.id""").fetchall()
    return [dict(row) for row in rows]


def _task_rows():
    with _connect() as db:
        rows = db.execute("""SELECT t.Ref, t.Description, t.Status, t.Priority, t.project,
            t.OverDue, ta.employee_id, ta.assigned_hours
            FROM tasks t LEFT JOIN task_assignments ta ON ta.task_id=t.id
            ORDER BY t.project, t.id""").fetchall()
    return [dict(row) for row in rows]


def _capacity_rows():
    employees = frame()
    employees["available_capacity"] = (employees["capacity"] - employees["avg_weekly_hours"]).clip(lower=0).round(1)
    return employees.sort_values(["available_capacity", "avg_weekly_hours"], ascending=[False, True]).to_dict("records")


def answer(message, user):
    query = message.lower().strip()
    role = user["role"]
    if role == "Employee":
        work = _my_work(user)
        tasks = work["tasks"]
        overdue = [task for task in tasks if task.get("OverDue") or (task.get("Target") and str(task["Target"]) < date.today().isoformat() and _is_open(task.get("Status")))]
        hours = sum(float(task.get("assigned_hours") or 0) for task in tasks if _is_open(task.get("Status")))
        if any(word in query for word in ("overdue", "late")):
            return f"You have {len(overdue)} overdue task(s).\n" + ("\n".join(f"• {task.get('Ref') or task.get('id')}: {task.get('Description') or 'No description'}" for task in overdue) if overdue else "No overdue tasks are currently assigned to you.")
        if any(word in query for word in ("workload", "capacity", "hours")):
            return f"Your current assigned open-task workload is {hours:g} hour(s) across {len([task for task in tasks if _is_open(task.get('Status'))])} open task(s)."
        if "project" in query:
            return "Your assigned projects:\n" + ("\n".join(f"• {p['id']} — {p.get('name')} ({p.get('status')})" for p in work["projects"]) if work["projects"] else "No projects are currently assigned to you.")
        return "I can show your assigned projects, tasks, overdue tasks, or current workload."

    if role == "HR Manager":
        employees = _capacity_rows()
        if any(word in query for word in ("available", "capacity")):
            available = [e for e in employees if str(e.get("availability", "")).lower() == "available" or e["available_capacity"] > 0]
            return "Employees with available capacity (live workforce data):\n" + ("\n".join(f"• #{e['employee_id']} — {e['department']} / {e['role_level']}: {e['available_capacity']:g} hour(s)" for e in available) if available else "No available capacity is currently recorded.")
        if "overload" in query or "overloaded" in query:
            overloaded = [e for e in employees if e["available_capacity"] <= 0]
            return "Employees at or above recorded capacity:\n" + ("\n".join(f"• #{e['employee_id']} — {e['department']} / {e['role_level']}: {e['avg_weekly_hours']:g}/{e['capacity']:g} hours" for e in overloaded) if overloaded else "No employees are currently at or above recorded capacity.")
        return f"The live workforce contains {len(employees)} employee record(s). Ask about capacity, availability, departments, roles, skills, workload, or overloaded employees."

    projects = _project_rows()
    if "task" in query or "assignment" in query:
        tasks = _task_rows()
        open_tasks = [task for task in tasks if _is_open(task.get("Status"))]
        return (f"Live task view: {len(open_tasks)} open task(s) across {len(projects)} project(s).\n" +
                ("\n".join(f"• {task.get('project')}: {task.get('Ref') or 'Unreferenced'} — {task.get('Status')}; assigned to #{task['employee_id']}" if task.get('employee_id') else f"• {task.get('project')}: {task.get('Ref') or 'Unreferenced'} — {task.get('Status')}; unassigned" for task in open_tasks[:20]) if open_tasks else "No open tasks are currently recorded."))
    if any(word in query for word in ("risk", "risks")):
        risks = risk_service.risks()
        return "Current derived project risks:\n" + ("\n".join(f"• {r['project']}: {r['risk_category']} ({r['risk_score']}) — {r['primary_risk_contributor']}" for r in risks[:10]) if risks else "No project risks are currently available.")
    if any(word in query for word in ("available", "capacity", "resource")):
        employees = _capacity_rows()
        available = [e for e in employees if e["available_capacity"] > 0]
        return "Potential resources with positive live capacity:\n" + ("\n".join(f"• #{e['employee_id']} — {e['department']} / {e['role_level']}: {e['available_capacity']:g} hour(s)" for e in available[:15]) if available else "No positive capacity is currently recorded.")
    if "overload" in query or "overloaded" in query:
        employees = _capacity_rows()
        overloaded = [e for e in employees if e["available_capacity"] <= 0]
        return "Employees at or above recorded capacity:\n" + ("\n".join(f"• #{e['employee_id']} — {e['avg_weekly_hours']:g}/{e['capacity']:g} hours" for e in overloaded) if overloaded else "No employees are currently at or above recorded capacity.")
    if "overdue" in query or "late" in query:
        return "Projects with overdue tasks:\n" + ("\n".join(f"• {p['id']}: {p['overdue_tasks']} overdue task(s)" for p in projects if p["overdue_tasks"]) if any(p["overdue_tasks"] for p in projects) else "No overdue tasks are currently recorded.")
    return "Live project overview:\n" + ("\n".join(f"• {p['id']} — {p.get('name')}: {p['open_tasks']}/{p['total_tasks']} open task(s), {p['overdue_tasks']} overdue" for p in projects[:15]) if projects else "No projects are currently available.")
