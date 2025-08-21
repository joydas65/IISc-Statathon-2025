"""
CSV -> Parquet using DuckDB only (no pyarrow)
- Reads CSV at data/raw/blkA202223.csv
- Writes Parquet at data/parquet/blkA202223.parquet
- Creates a VIEW (default) OR a TABLE over the Parquet in DuckDB
Run:  python backend/ingest/ingest_cli.py
"""

import os, duckdb

RAW = "data/raw/blkA202223.csv"
PARQUET = "data/parquet/blkA202223.parquet"
DBPATH = "data/statathon.duckdb"

# Toggle: set True to materialize a TABLE; False keeps a VIEW over Parquet
MATERIALIZE = False

os.makedirs("data/raw", exist_ok=True)
os.makedirs("data/parquet", exist_ok=True)

if not os.path.exists(RAW):
    raise FileNotFoundError(f"CSV not found at {RAW}. Put your file there.")

con = duckdb.connect(DBPATH)

# 1) CSV -> Parquet (DuckDB COPY)
con.execute(f"""
    COPY (
      SELECT * FROM read_csv_auto('{RAW}', HEADER=TRUE, SAMPLE_SIZE=-1)
    )
    TO '{PARQUET}' (FORMAT 'parquet');
""")

# 2) Register a stable name in DuckDB
if MATERIALIZE:
    con.execute("DROP TABLE IF EXISTS blkA202223")
    con.execute(f"CREATE TABLE blkA202223 AS SELECT * FROM read_parquet('{PARQUET}')")
else:
    con.execute("DROP VIEW IF EXISTS blkA202223")
    con.execute(f"CREATE VIEW blkA202223 AS SELECT * FROM read_parquet('{PARQUET}')")

# 3) Quick sanity check
cnt = con.execute("SELECT COUNT(*) FROM blkA202223").fetchone()[0]
con.close()
print(f"Ingest complete. Rows in blkA202223: {cnt}")
print(f"Parquet at: {PARQUET}")
print(f"DuckDB at : {DBPATH}")
