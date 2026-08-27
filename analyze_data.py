import pandas as pd

tasks_path = "project_management_data/Construction_Data_PM_Tasks_All_Projects.csv"
forms_path = "project_management_data/Construction_Data_PM_Forms_All_Projects.csv"
employees_path = "employee_workload/employee_performance_workload_attrition.csv"

tasks = pd.read_csv(tasks_path)
forms = pd.read_csv(forms_path)
employees = pd.read_csv(employees_path)

# ---------------- TASKS ----------------
print("\n" + "="*60)
print("TASK ANALYSIS")
print("="*60)

print("\nTask Status:")
print(tasks["Status"].value_counts())

print("\nTask Groups:")
print(tasks["Task Group"].value_counts().head(15))

print("\nTask Types:")
print(tasks["Type"].value_counts().head(15))

print("\nPriority:")
print(tasks["Priority"].value_counts(dropna=False))

print("\nOverdue:")
print(tasks["OverDue"].value_counts())

print("\nProjects:")
print("Unique projects:", tasks["project"].nunique())

print("\nTop projects by number of tasks:")
print(tasks["project"].value_counts().head(15))

# ---------------- FORMS ----------------
print("\n" + "="*60)
print("FORM ANALYSIS")
print("="*60)

print("\nForm Status:")
print(forms["Status"].value_counts().head(15))

print("\nReport Form Groups:")
print(forms["Report Forms Group"].value_counts().head(15))

print("\nOverdue:")
print(forms["OverDue"].value_counts())

print("\nProjects:")
print("Unique projects:", forms["Project"].nunique())

# ---------------- EMPLOYEES ----------------
print("\n" + "="*60)
print("EMPLOYEE ANALYSIS")
print("="*60)

print("\nDepartments:")
print(employees["department"].value_counts())

print("\nRole Levels:")
print(employees["role_level"].value_counts())

print("\nAverage weekly hours:")
print(employees["avg_weekly_hours"].describe())

print("\nProjects handled:")
print(employees["projects_handled"].describe())

print("\nPerformance rating:")
print(employees["performance_rating"].value_counts().sort_index())

print("\nAttrition:")
print(employees["attrition"].value_counts())

print("\nJob satisfaction:")
print(employees["job_satisfaction"].value_counts().sort_index())

print("\nAbsence days:")
print(employees["absences_days"].describe())

print("\nAnalysis complete.")

