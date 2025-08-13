from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite for dev. Swap to Postgres by replacing URL, e.g.:
# DATABASE_URL = "postgresql+psycopg2://user:pass@host:5432/PIS"
DATABASE_URL = "sqlite:///./PIS.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
