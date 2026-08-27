import pandas as pd
from pathlib import Path

# Paths
tasks_file = "project_management_data/Construction_Data_PM_Tasks_All_Projects.csv"
forms_file = "project_management_data/Construction_Data_PM_Forms_All_Projects.csv"
employees_file = "employee_workload/employee_performance_workload_attrition.csv"

output = Path("data_cleaned")
output.mkdir(exist_ok=True)

# =========================
# TASKS
# =========================

tasks = pd.read_csv(tasks_file)

# Convert dates
for col in ["Created", "Target", "Status Changed"]:
    tasks[col] = pd.to_datetime(tasks[col], dayfirst=True, errors="coerce")

# Boolean
tasks["OverDue"] = tasks["OverDue"].astype(bool)

# Missing categorical values
tasks["Priority"] = tasks["Priority"].fillna("Not Specified")
tasks["Cause"] = tasks["Cause"].fillna("Not Specified")
tasks["Task Group"] = tasks["Task Group"].fillna("Not Specified")
tasks["To Package"] = tasks["To Package"].fillna("Not Specified")

# Save
tasks.to_csv(output / "tasks_clean.csv", index=False)

# =========================
# FORMS
# =========================

forms = pd.read_csv(forms_file)

for col in ["Created", "Status Changed"]:
    forms[col] = pd.to_datetime(forms[col], dayfirst=True, errors="coerce")

forms["OverDue"] = forms["OverDue"].astype(bool)

forms["Report Forms Status"] = forms["Report Forms Status"].fillna("Not Specified")
forms["Report Forms Group"] = forms["Report Forms Group"].fillna("Not Specified")

forms.to_csv(output / "forms_clean.csv", index=False)

# =========================
# EMPLOYEES
# =========================

employees = pd.read_csv(employees_file)

numeric_columns = [
    "monthly_salary",
    "avg_weekly_hours",
    "projects_handled",
    "performance_rating",
    "absences_days",
    "job_satisfaction"
]

for col in numeric_columns:
    employees[col] = pd.to_numeric(employees[col], errors="coerce")

employees.to_csv(output / "employees_clean.csv", index=False)

print("Cleaning completed successfully!")
print()
print("Tasks:", len(tasks))
print("Forms:", len(forms))
print("Employees:", len(employees))
print()
print("Clean files saved in:", output)
