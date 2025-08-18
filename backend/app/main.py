from fastapi import FastAPI
from .routers import health, datasets, query, usage

app = FastAPI(title="Survey SQL API Gateway", version="0.1.0")
app.include_router(health.router)
app.include_router(datasets.router)
app.include_router(query.router)
app.include_router(usage.router)
