import time
from typing import Any
from ..db import get_duck
from ..settings import settings

def run_query(sql: str, params: dict[str, Any] | None = None, limit: int | None = None):
    t0 = time.time()
    con = get_duck()
    if limit and " limit " not in sql.lower():
        sql = f"{sql} LIMIT {int(limit)}"
    cur = con.execute(sql, params or {})
    rows = cur.fetchall()
    cols = [d[0] for d in cur.description]
    dur_ms = int((time.time() - t0) * 1000)
    return {
        "data": [dict(zip(cols, r)) for r in rows],
        "meta": {"columns": cols, "row_count": len(rows), "duration_ms": dur_ms},
    }
