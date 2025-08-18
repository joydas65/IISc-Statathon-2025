import time
from collections import defaultdict
from .errors import RateLimited

QPS = 5
BURST = 10
_buckets = defaultdict(lambda: {"tokens": BURST, "ts": time.time()})
_counters = defaultdict(lambda: {"rows": 0, "bytes": 0, "queries": 0, "window_start": int(time.time())})

def rate_limit(key: str):
    now = time.time()
    b = _buckets[key]
    elapsed = now - b["ts"]
    b["tokens"] = min(BURST, b["tokens"] + elapsed * QPS)
    b["ts"] = now
    if b["tokens"] < 1:
        raise RateLimited("Too many requests; please slow down")
    b["tokens"] -= 1

def post_usage(key: str, rows: int, bytes_scanned: int):
    c = _counters[key]
    c["rows"] += rows
    c["bytes"] += bytes_scanned
    c["queries"] += 1
    return c

def get_usage(key: str):
    return _counters[key]
