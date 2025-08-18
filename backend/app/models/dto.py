from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class QueryRequest(BaseModel):
    sql: str
    params: Optional[Dict[str, Any]] = None
    limit: Optional[int] = Field(default=None, ge=1)

class QueryResponse(BaseModel):
    trace_id: str
    meta: Dict[str, Any]
    data: List[Dict[str, Any]]
    page: Dict[str, Any] | None = None

class FilterQueryResponse(QueryResponse):
    warnings: list[str] | None = None
