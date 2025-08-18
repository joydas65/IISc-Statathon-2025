from fastapi import APIRouter, Depends, Query as Q
from typing import Optional
from ..deps import get_user, User
from ..models.dto import QueryRequest, QueryResponse, FilterQueryResponse
from ..core.validator import ensure_select_only
from ..core.registry import load_survey
from ..core.exec import run_query
from ..core.meter import rate_limit, post_usage
from ..core.privacy import suppress_small_cells
from ..settings import settings

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query(req: QueryRequest, user: User = Depends(get_user)):
    rate_limit(user.user_id)
    ensure_select_only(req.sql)
    res = run_query(req.sql, req.params or {}, req.limit or settings.DEFAULT_LIMIT)
    usage = post_usage(user.user_id, res["meta"]["row_count"], 0)
    return {"trace_id": user.user_id, "meta": {**res["meta"], "usage": usage}, "data": res["data"], "page": None}

@router.get("/{survey}/data", response_model=FilterQueryResponse)
async def filter_query(
    survey: str,
    group_by: Optional[str] = Q(default=None, description="comma-separated columns to group by"),
    limit: int = Q(default=100, ge=1, le=5000),
    user: User = Depends(get_user),
    **filters,
):
    rate_limit(user.user_id)
    cfg = load_survey(survey)
    allow = set(cfg.allowlist_filters)
    usable = {k: v for k, v in filters.items() if k in allow}

    # Build safe SQL
    params = {}
    where_clauses = []
    for i, (k, v) in enumerate(usable.items(), start=1):
        pname = f"p{i}"
        where_clauses.append(f"{k} = :{pname}")
        params[pname] = v

    gb_cols = [c.strip() for c in (group_by or "").split(",") if c.strip()]
    table = cfg.table
    select_part = (", ".join(gb_cols) + ", ") if gb_cols else ""
    base = f"SELECT {select_part}COUNT(*) as n FROM {table}"
    where_sql = (" WHERE " + " AND ".join(where_clauses)) if where_clauses else ""
    group_sql = (f" GROUP BY {', '.join(gb_cols)}") if gb_cols else ""
    sql = base + where_sql + group_sql

    res = run_query(sql, params, limit)
    # k-anonymity suppression (k=10) on aggregated results
    suppressed = 0
    if gb_cols:
        res["data"], suppressed = suppress_small_cells(res["data"], k=10, count_col="n")

    usage = post_usage(user.user_id, res["meta"]["row_count"], 0)
    meta = {**res["meta"], "survey": survey, "usage": usage, "suppression": {"k": 10, "suppressed_cells": suppressed}}
    return {"trace_id": user.user_id, "meta": meta, "data": res["data"], "page": None, "warnings": []}
