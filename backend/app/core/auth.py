import base64, hashlib, hmac, json, time
from fastapi import Depends, Header, HTTPException

from .config import SECRET
from .users import find, verify_password

PERMISSIONS = {"Admin": {"dashboard", "projects", "risk", "workforce", "resources", "attrition", "employees", "user_management", "user_management_write", "projects_write", "employees_write"},
               "Project Manager": {"dashboard", "projects", "risk", "resources", "employees", "projects_write"},
               "HR Manager": {"dashboard", "workforce", "attrition", "employees", "employees_write"}}
DEMO_PERMISSIONS = {"Admin": {"dashboard", "projects", "risk", "workforce", "resources", "attrition", "employees", "user_management"},
                   "Project Manager": {"dashboard", "projects", "risk", "resources", "employees"},
                   "HR Manager": {"dashboard", "workforce", "attrition", "employees"}}

ROLES = set(PERMISSIONS)


def login(username, password):
    user = find(username)
    if not user or not user["is_active"] or not verify_password(password, user["password_hash"]):
        raise HTTPException(401, "Invalid username or password")
    payload = {"sub": user["username"], "user_id": user["id"], "exp": int(time.time()) + 8 * 3600}
    raw = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    sig = hmac.new(SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}.{sig}", payload


def demo_login(role):
    if role not in ROLES:
        raise HTTPException(400, "Invalid demo role")
    payload = {"sub": f"demo:{role}", "role": role, "demo": True, "exp": int(time.time()) + 2 * 3600}
    raw = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    sig = hmac.new(SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}.{sig}", payload


def current_user(authorization: str = Header(default="")):
    try:
        scheme, token = authorization.split(" ", 1)
        raw, sig = token.split(".", 1)
        if scheme.lower() != "bearer" or not hmac.compare_digest(sig, hmac.new(SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()):
            raise ValueError
        payload = json.loads(base64.urlsafe_b64decode(raw.encode()))
        if payload["exp"] < time.time():
            raise ValueError
        if payload.get("demo"):
            if payload.get("role") not in ROLES:
                raise ValueError
            return {"sub": payload["sub"], "role": payload["role"], "demo": True}
        user = find(payload.get("user_id", payload["sub"]))
        if not user or not user["is_active"]:
            raise ValueError
        return {"sub": user["username"], "user_id": user["id"], "role": user["role"], "demo": False}
    except Exception:
        raise HTTPException(401, "Authentication required")


def require(scope):
    def dependency(user=Depends(current_user)):
        permissions = DEMO_PERMISSIONS if user.get("demo") else PERMISSIONS
        if scope not in permissions.get(user["role"], set()):
            raise HTTPException(403, "You are not authorized to access this resource")
        return user
    return dependency
