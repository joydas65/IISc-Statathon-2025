from sqlglot import parse_one, exp
from .errors import PolicyViolation

FORBIDDEN = {"INSERT","UPDATE","DELETE","CREATE","ALTER","DROP","PRAGMA","ATTACH","CALL","COPY"}

def ensure_select_only(sql: str) -> None:
    try:
        tree = parse_one(sql)
    except Exception as e:
        raise PolicyViolation(f"SQL parse error: {e}")
    if not isinstance(tree, (exp.Select, exp.Union, exp.With)):
        raise PolicyViolation("Only SELECT queries are allowed")
    up = sql.upper()
    for kw in FORBIDDEN:
        if kw in up:
            raise PolicyViolation(f"Keyword not allowed: {kw}")
