import base64, hashlib, hmac, json, os, time
from fastapi import HTTPException, Header
from .config import SECRET

_demo = {"admin": ("Admin", "Admin@123"), "project_manager": ("Project Manager", "Manager@123"), "hr_manager": ("HR Manager", "HR@123")}
USERS = {u: {"role": r, "password_hash": hashlib.sha256(p.encode()).hexdigest()} for u, (r,p) in _demo.items()}
PERMISSIONS = {"Admin": {"dashboard","projects","risk","workforce","resources","attrition","employees"}, "Project Manager": {"dashboard","projects","risk","resources","employees"}, "HR Manager": {"dashboard","workforce","attrition","employees"}}

def login(username, password):
    user = USERS.get(username)
    if not user or not hmac.compare_digest(user["password_hash"], hashlib.sha256(password.encode()).hexdigest()):
        raise HTTPException(401, "Invalid username or password")
    payload = {"sub": username, "role": user["role"], "exp": int(time.time()) + 8*3600}
    raw = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    sig = hmac.new(SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}.{sig}", payload

def current_user(authorization: str = Header(default="")):
    try:
        scheme, token = authorization.split(" ", 1); raw, sig = token.split(".",1)
        if scheme.lower() != "bearer" or not hmac.compare_digest(sig, hmac.new(SECRET.encode(),raw.encode(),hashlib.sha256).hexdigest()): raise ValueError
        payload=json.loads(base64.urlsafe_b64decode(raw.encode()));
        if payload["exp"] < time.time(): raise ValueError
        return payload
    except Exception:
        raise HTTPException(401, "Authentication required")

def require(scope):
    def dependency(user=__import__('fastapi').Depends(current_user)):
        if scope not in PERMISSIONS.get(user["role"], set()): raise HTTPException(403, "You are not authorized to access this resource")
        return user
    return dependency
