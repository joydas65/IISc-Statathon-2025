from fastapi import Header
from pydantic import BaseModel

class User(BaseModel):
    user_id: str
    role: str  # public | researcher | admin

async def get_user(authorization: str | None = Header(default=None)) -> User:
    # Demo token format: "Bearer role:user", e.g., "Bearer public:guest"
    role, user_id = "public", "guest"
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        if ":" in token:
            r, u = token.split(":", 1)
            if r in {"public", "researcher", "admin"}:
                role, user_id = r, u
    return User(user_id=user_id, role=role)
