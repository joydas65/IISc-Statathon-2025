from .errors import PolicyViolation

def enforce_projection(selected_cols: list[str], policies: dict) -> None:
    pii = set(policies.get("pii", []))
    if pii & set(selected_cols):
        raise PolicyViolation("PII columns cannot be selected: " + ", ".join(sorted(pii & set(selected_cols))))

def requires_aggregation(selected_cols: list[str], policies: dict) -> bool:
    sensitive = set(policies.get("sensitive", []))
    return bool(sensitive & set(selected_cols))

# k-anonymity suppression hook (apply post-aggregation)
def suppress_small_cells(rows: list[dict], k: int = 10, count_col: str = "n") -> tuple[list[dict], int]:
    suppressed = 0
    out = []
    for r in rows:
        v = r.get(count_col)
        if isinstance(v, (int, float)) and v < k:
            r = {**r, count_col: "*"}
            suppressed += 1
        out.append(r)
    return out, suppressed
