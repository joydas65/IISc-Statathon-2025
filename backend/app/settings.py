from pydantic import BaseModel
import os

class Settings(BaseModel):
    DUCKDB_PATH: str = os.getenv("DUCKDB_PATH", "data/statathon.duckdb")
    REGISTRY_PATH: str = os.getenv("REGISTRY_PATH", "backend/app/registry/surveys")
    DEFAULT_LIMIT: int = int(os.getenv("DEFAULT_LIMIT", "100"))
    MAX_LIMIT: int = int(os.getenv("MAX_LIMIT", "5000"))
    QUERY_TIMEOUT_MS: int = int(os.getenv("QUERY_TIMEOUT_MS", "15000"))

settings = Settings()