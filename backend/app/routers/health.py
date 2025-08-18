from fastapi import APIRouter
router = APIRouter()

@router.get("/metrics/health")
def health():
    return {"status": "ok"}
