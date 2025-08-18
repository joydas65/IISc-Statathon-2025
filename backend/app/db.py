import duckdb
from .settings import settings

_conn = None

def get_duck() -> duckdb.DuckDBPyConnection:
    global _conn
    if _conn is None:
        _conn = duckdb.connect(settings.DUCKDB_PATH)
    return _conn