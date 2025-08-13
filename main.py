from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .routers import kpi, chatbot, ws
from .seed import run as seed_run

app = FastAPI(title="PIS Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # lock down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB init/seed
Base.metadata.create_all(bind=engine)
seed_run()

app.include_router(kpi.router)
app.include_router(chatbot.router)
app.include_router(ws.router)
