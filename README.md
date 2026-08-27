# KSHAMTA

## Project Intelligence & Resource Analytics Platform

KSHAMTA is a portfolio full-stack application I designed and developed to turn supplied project-management and workforce data into explainable business intelligence. It combines a React dashboard with a FastAPI REST API, deterministic pandas analytics, and a scikit-learn attrition model.

## Business objective and capabilities

Organizations need a clear view of operational delivery and workforce characteristics. KSHAMTA provides project metrics, risk intelligence, interactive task/form analytics, workforce observations, attrition estimates, simulated resource recommendations, and what-if resource-unavailability analysis. Authentication exposes only the appropriate capabilities for Admin, Project Manager, and HR Manager roles.

## Architecture

```text
React + Vite + Tailwind + Recharts  →  FastAPI REST API  →  pandas / scikit-learn
                                             ↓
                    supplied cleaned CSV datasets + models/attrition_model.joblib
```

The frontend contains presentation, route protection, loading/error states, and API calls. The backend owns authorization, validation, data processing, risk calculations, recommendation scoring, and ML inference. This separation keeps business logic out of React components.

## Dataset and data-processing approach

`tasks_clean.csv` and `forms_clean.csv` create project intelligence. `employees_clean.csv` creates workforce intelligence. CSVs are loaded read-only, dates are safely parsed, categorical gaps are represented as `Unknown`, boolean-like values are normalized, and numeric employee fields are imputed only for analysis/model processing.

The employee dataset is not directly linked to the historical project/task dataset by employee or assignment IDs. Therefore, resource recommendations are simulated recommendations based on employee characteristics rather than historical employee-project assignments.

## Methods

- **Project Risk Score:** overdue rate × 35 + open-task rate × 25 + high-priority rate × 25 + safety-issue rate × 15. The Project Risk Score is a derived analytical metric created by KSHAMTA and is not an official score from the original dataset.
- **Resource recommendation:** transparent 0–100 suitability score using department/role match, performance, estimated capacity, workload, projects handled, absence days, and job satisfaction. 40 hours/week is an assumed baseline for recommendation purposes.
- **What-if simulation:** estimates a capacity reduction from the selected employee’s weekly workload and generates replacement suggestions using the same simulated scoring method. It does not infer project assignments.
- **ML:** Logistic Regression and Random Forest are evaluated with a stratified 80/20 split (`random_state=42`) using a scikit-learn pipeline with categorical one-hot encoding and numeric median imputation. The highest ROC-AUC model is serialized with Joblib.

The attrition prediction is a statistical estimate and is not a guarantee that an employee will leave. Workforce relationships are observations, not causal conclusions.

## Run locally

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python ../ml/train_model.py
uvicorn app.main:app --reload --port 8000
```

Frontend (separate terminal):

```bash
cd frontend
npm install
npm run dev
```

URLs: frontend `http://localhost:5173`, backend `http://localhost:8000`, API documentation `http://localhost:8000/docs`.

Demo-only users: `admin / Admin@123`, `project_manager / Manager@123`, and `hr_manager / HR@123`.

## Project structure

```text
frontend/       React/Vite interface, Tailwind styling, Recharts, SVG identity
backend/app/    FastAPI routes, security, schemas, and analytics services
ml/             model-training entry point
src/            retained reusable data/ML feature-engineering modules
models/         trained local Joblib model
data_cleaned/   supplied immutable cleaned datasets
```

## Screenshots

Add local screenshots of the login, executive dashboard, risk table, resource simulation, and attrition screen here after running the application.

## Limitations and future work

KSHAMTA does not claim historical employee-project assignments, production identity management, real-time data feeds, causal outcomes, or optimization guarantees. Future work could add verified assignment data, a database, audit logging, calendar integrations, alerts, model monitoring, and production authentication.
