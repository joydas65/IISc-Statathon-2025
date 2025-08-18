import os, yaml
from dataclasses import dataclass
from typing import Any
from ..settings import settings

@dataclass
class SurveyConfig:
    survey: str
    title: str
    table: str
    storage: dict
    variables: dict
    policies: dict
    allowlist_filters: list[str]

_cache: dict[str, SurveyConfig] = {}

def load_survey(survey: str) -> SurveyConfig:
    if survey in _cache:
        return _cache[survey]
    path = os.path.join(settings.REGISTRY_PATH, f"{survey}.yaml")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Registry YAML not found for {survey}: {path}")
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    cfg = SurveyConfig(
        survey=data["survey"],
        title=data.get("title", data["survey"]),
        table=data["table"],
        storage=data.get("storage", {}),
        variables=data.get("variables", {}),
        policies=data.get("policies", {}),
        allowlist_filters=data.get("allowlist_filters", []),
    )
    _cache[survey] = cfg
    return cfg

def list_surveys() -> list[dict[str, Any]]:
    base = settings.REGISTRY_PATH
    if not os.path.exists(base): return []
    out = []
    for fn in os.listdir(base):
        if fn.endswith(".yaml"):
            with open(os.path.join(base, fn), "r", encoding="utf-8") as f:
                d = yaml.safe_load(f)
                out.append({"survey": d.get("survey"), "title": d.get("title"), "table": d.get("table")})
    return sorted(out, key=lambda x: x["survey"])
