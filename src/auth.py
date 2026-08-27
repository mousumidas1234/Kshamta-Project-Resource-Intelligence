import hashlib
import streamlit as st

USERS={"admin":("Admin","Admin@123"),"project_manager":("Project Manager","Manager@123"),"hr_manager":("HR Manager","HR@123")}
PERMISSIONS={"Admin":set(["Dashboard","Project Analytics","Project Risk Intelligence","Workforce Analytics","Simulated Resource Recommendation","What-If Resource Simulation","Attrition Prediction","Project Details","Employee Details"]),"Project Manager":set(["Dashboard","Project Analytics","Project Risk Intelligence","Simulated Resource Recommendation","What-If Resource Simulation","Project Details"]),"HR Manager":set(["Dashboard","Workforce Analytics","Attrition Prediction","Employee Details"])}
def digest(value): return hashlib.sha256(value.encode()).hexdigest()
HASHES={u:(r,digest(p)) for u,(r,p) in USERS.items()}
def login():
    st.title("KSHAMTA"); st.caption("Project Intelligence & Resource Analytics Platform")
    st.info("Demo Authentication — portfolio demonstration only.")
    with st.form("login"):
        username=st.text_input("Username"); password=st.text_input("Password",type="password")
        if st.form_submit_button("Login"):
            user=HASHES.get(username)
            if user and user[1]==digest(password): st.session_state.update(authenticated=True,username=username,role=user[0]); st.rerun()
            st.error("Invalid username or password.")
def allowed(page): return page in PERMISSIONS.get(st.session_state.get("role"),set())
