from pydantic import BaseModel
from datetime import datetime

class KPI(BaseModel):
    FeatureName: str
    KPI_Count: int
    Type: str

    class Config:
        from_attributes = True

class IncrementRequest(BaseModel):
    feature_name: str

class TrendPoint(BaseModel):
    ts: datetime
    count: int
