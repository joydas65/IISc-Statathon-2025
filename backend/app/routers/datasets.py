from fastapi import APIRouter
from ..core.registry import list_surveys, load_survey

router = APIRouter()

@router.get("/datasets")
def datasets():
    return {"surveys": list_surveys()}

@router.get("/schema/{survey}")
def schema(survey: str):
    cfg = load_survey(survey)
    return {
        "survey": cfg.survey,
        "title": cfg.title,
        "table": cfg.table,
        "variables": cfg.variables,
        "policies": cfg.policies,
        "allowlist_filters": cfg.allowlist_filters,
    }
