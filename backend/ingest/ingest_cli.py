"""
Simple ingestion:
- Reads CSV at data/raw/blkA202223.csv
- Writes Parquet at data/parquet/blkA202223.parquet
- Creates/refreshes DuckDB table 'blkA202223' pointing to Parquet
Run:  python backend/ingest/ingest_cli.py
"""
import os, duckdb, pyarrow as pa, pyarrow.csv as pv, pyarrow.parquet as pq

RAW = "data/raw/blkA202223.csv"
PARQUET = "data/parquet/blkA202223.parquet"
DBPATH = "data/statathon.duckdb"

os.makedirs("data/parquet", exist_ok=True)
os.makedirs("data/raw", exist_ok=True)

# CSV -> Parquet (streaming)
table = pv.read_csv(RAW)
pq.write_table(table, PARQUET)

con = duckdb.connect(DBPATH)
con.execute("DROP VIEW IF EXISTS blkA202223")
con.execute("DROP TABLE IF EXISTS blkA202223")
con.execute(f"CREATE TABLE blkA202223 AS SELECT * FROM read_parquet('{PARQUET}')")
con.close()
print("Ingested to DuckDB and created table 'blkA202223'.")
