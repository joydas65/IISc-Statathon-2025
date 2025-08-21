from fastapi import HTTPException
from ..db import get_duck

def run_query(sql, params=None, limit=None):
    con = get_duck()
    if limit and " limit " not in sql.lower():
        sql = f"{sql} LIMIT {int(limit)}"
    try:
        cur = con.execute(sql, params or {})
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
    except Exception as e:
        # Return a clear 400 with the engine's message
        raise HTTPException(status_code=400, detail={"error":"ENGINE_ERROR","message":str(e)})
    return {
        "data": [dict(zip(cols, r)) for r in rows],
        "meta": {"columns": cols, "row_count": len(rows), "duration_ms": 0}
    }
