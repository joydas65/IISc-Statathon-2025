from fastapi import APIRouter, Depends
from ..deps import get_user, User
from ..core.meter import get_usage

router = APIRouter()

@router.get("/usage/me")
async def usage(user: User = Depends(get_user)):
    return {"user": user.user_id, "role": user.role, "usage": get_usage(user.user_id)}
