from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .core.db_init import initialize_db

initialize_db()


app=FastAPI(title="KSHAMTA API",version="1.0.0",description="Project Intelligence & Resource Analytics Platform API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://kshamta-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
@app.get("/health")
def health(): return {"status":"ok","product":"KSHAMTA"}
