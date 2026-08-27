import pandas as pd
from pathlib import Path

base = Path(".")

files = {
    "Tasks": base / "project_management_data/Construction_Data_PM_Tasks_All_Projects.csv",
    "Forms": base / "project_management_data/Construction_Data_PM_Forms_All_Projects.csv",
    "Employees": base / "employee_workload/employee_performance_workload_attrition.csv"
}

for name, file in files.items():
    print("\n" + "=" * 60)
    print(name.upper())
    print("=" * 60)

    df = pd.read_csv(file)

    print("Rows:", len(df))
    print("Columns:", len(df.columns))

    print("\nColumns:")
    print(df.columns.tolist())

    print("\nMissing values:")
    print(df.isnull().sum())

    print("\nDuplicate rows:", df.duplicated().sum())

    print("\nFirst 3 rows:")
    print(df.head(3).to_string(index=False))
