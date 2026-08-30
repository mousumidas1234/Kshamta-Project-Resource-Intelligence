import pandas as pd

from .workforce_service import frame
from .data_service import records

BASELINE_HOURS = 40.0


def _num(value, digits=1):
    value = float(value)
    return int(value) if value.is_integer() else round(value, digits)


def _explanation(row, department, role_level, workload, min_performance,
                 dep_match, role_match, perf_match, capacity_ok, capacity):
    hours = _num(row.avg_weekly_hours)
    workload_text = _num(workload)
    capacity_text = _num(capacity)
    perf_text = _num(row.performance_rating)
    min_text = _num(min_performance)

    # Keep explanations short, but describe every material constraint with actual values.
    if dep_match and role_match and perf_match and capacity_ok:
        return (f"Strong department and role match, performance meets the minimum requirement, "
                f"and {capacity_text} simulated hours of capacity are available against an "
                f"{workload_text}-hour workload.")
    if dep_match and role_match and perf_match and capacity <= 0:
        return ("Department, role, and performance may match, but the employee has no simulated "
                f"available capacity because current weekly hours ({hours}) are at or above the "
                f"{_num(BASELINE_HOURS)}-hour baseline.")

    parts = []
    if not dep_match:
        parts.append(f"the employee is from {row.department} while {department} is required")
    if not role_match:
        parts.append(f"the employee is {row.role_level} while {role_level} is required")
    if not perf_match:
        parts.append(f"the performance rating of {perf_text} is below the required minimum of {min_text}")
    if not capacity_ok:
        parts.append(f"available simulated capacity ({capacity_text} hours) is insufficient for the requested {workload_text}-hour workload")

    if dep_match and role_match and perf_match:
        return (f"Strong department and role match, performance meets the minimum requirement, "
                f"but only {capacity_text} simulated hours of capacity are available against an "
                f"{workload_text}-hour workload.")
    if dep_match and role_match:
        prefix = "Department and role match"
        if len(parts) == 1:
            return prefix + ", but " + parts[0] + "."
        return prefix + ", but " + " and ".join(parts) + "."
    if role_match and perf_match and not dep_match:
        return f"Role and performance are suitable, but {parts[0]}."
    if dep_match and perf_match and not role_match:
        return f"Department matches {department}, but {parts[0]}."
    return "; ".join(parts).capitalize() + "."


def recommend(department, role_level, workload, min_performance, exclude=None):
    e = frame()
    if exclude is not None:
        e = e[e.employee_id.astype(str) != str(exclude)].copy()
    workload = float(workload)
    min_performance = float(min_performance)
    capacity = (e.capacity - e.avg_weekly_hours).clip(lower=0)
    dep_match = e.department.eq(department)
    role_match = e.role_level.eq(role_level)
    perf_match = e.performance_rating.ge(min_performance)
    capacity_ok = capacity.ge(workload)

    # Explainable score. Capacity is proportional to the requested workload, not a binary bonus.
    capacity_ratio = (capacity / workload).clip(upper=1) if workload > 0 else capacity * 0 + 1
    projects_norm = (1 - e.projects_handled / e.projects_handled.max()).fillna(0)
    absence_norm = (1 - e.absences_days / e.absences_days.max()).fillna(0)
    satisfaction_norm = (e.job_satisfaction / e.job_satisfaction.max()).fillna(0)
    e["suitability_score"] = (dep_match.astype(float) * 25 + role_match.astype(float) * 20 +
                               perf_match.astype(float) * 15 + capacity_ratio * 20 +
                               projects_norm * 10 + absence_norm * 5 + satisfaction_norm * 5).round(1)
    e["available_simulated_capacity"] = capacity.round(1)
    e["required_workload"] = round(workload, 1)
    e["capacity_gap"] = (capacity - workload).round(1)

    def classify(row):
        d, r, p, c = bool(dep_match.loc[row.name]), bool(role_match.loc[row.name]), bool(perf_match.loc[row.name]), bool(capacity_ok.loc[row.name])
        major = sum([not d, not r, not p, workload > 0 and capacity.loc[row.name] <= 0])
        if d and r and p and c:
            return "Recommended"
        if (not p) or major >= 2 or (workload > 0 and capacity.loc[row.name] <= 0) or (not d and not r):
            return "Avoid"
        return "Consider"

    e["recommendation"] = e.apply(classify, axis=1)
    e["explanation"] = e.apply(lambda row: _explanation(
        row, department, role_level, workload, min_performance,
        bool(dep_match.loc[row.name]), bool(role_match.loc[row.name]),
        bool(perf_match.loc[row.name]), bool(capacity_ok.loc[row.name]),
        float(capacity.loc[row.name])), axis=1)
    return records(e.sort_values(["suitability_score", "available_simulated_capacity"], ascending=False))


def what_if(employee_id):
    e = frame()
    found = e[e.employee_id.astype(str) == str(employee_id)]
    if found.empty:
        return None
    person = found.iloc[0]
    available = max(0.0, float(person.capacity) - float(person.avg_weekly_hours))
    risk = "High" if available >= 35 else "Medium" if available >= 20 else "Low"
    return {
        "selected_employee": str(person.employee_id),
        "department": str(person.department),
        "role_level": str(person.role_level),
        "weekly_hours": _num(person.avg_weekly_hours),
        "current_weekly_hours": _num(person.avg_weekly_hours),
        "projects_handled": _num(person.projects_handled),
        "current_projects_handled": _num(person.projects_handled),
        "performance_rating": _num(person.performance_rating),
        "current_simulated_available_capacity": _num(available),
        "simulated_capacity_reduction": _num(available),
        "estimated_workload_impact": _num(available),
        "workload_impact": f"{_num(available)} simulated hours become unavailable",
        "risk_level": risk,
        "replacement_recommendations": recommend(person.department, person.role_level, available, person.performance_rating, person.employee_id)[:10],
    }
