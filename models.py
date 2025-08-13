from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base

# PIS_KPI as requested
class PISKPI(Base):
    __tablename__ = "PIS_KPI"
    FeatureName = Column(String, primary_key=True, index=True)
    KPI_Count = Column(Integer, nullable=False, default=0)
    Type = Column(String, nullable=False, default="tool")  # "tool" or "category"

    history = relationship("PISKPIHistory", back_populates="kpi", cascade="all, delete-orphan")

class PISKPIHistory(Base):
    __tablename__ = "PIS_KPI_HISTORY"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    feature_name = Column(String, ForeignKey("PIS_KPI.FeatureName", ondelete="CASCADE"))
    ts = Column(DateTime, nullable=False, default=datetime.utcnow)
    count = Column(Integer, nullable=False)  # snapshot after increment

    kpi = relationship("PISKPI", back_populates="history")
