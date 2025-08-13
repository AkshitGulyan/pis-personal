from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from typing import List
from datetime import datetime, timedelta

from ..deps import get_db
from ..models import PISKPI, PISKPIHistory
from ..schemas import KPI, IncrementRequest, TrendPoint
from ..routers.ws import broadcaster

router = APIRouter(prefix="/kpis", tags=["kpis"])

@router.get("", response_model=List[KPI])
def get_all_kpis(db: Session = Depends(get_db)):
    return db.execute(select(PISKPI)).scalars().all()

@router.get("/categories", response_model=List[KPI])
def get_category_kpis(db: Session = Depends(get_db)):
    return db.execute(select(PISKPI).where(PISKPI.Type == "category")).scalars().all()

@router.get("/tools", response_model=List[KPI])
def get_tool_kpis(db: Session = Depends(get_db)):
    return db.execute(select(PISKPI).where(PISKPI.Type == "tool")).scalars().all()

@router.post("/increment")
def increment_hit(data: IncrementRequest, db: Session = Depends(get_db)):
    kpi = db.get(PISKPI, data.feature_name)
    if not kpi:
        raise HTTPException(status_code=404, detail="Feature not found")
    kpi.KPI_Count += 1
    db.add(PISKPIHistory(feature_name=kpi.FeatureName, count=kpi.KPI_Count))
    db.commit()
    db.refresh(kpi)

    # broadcast realtime update
    payload = {
        "type": "kpi_update",
        "feature": kpi.FeatureName,
        "count": kpi.KPI_Count,
        "ts": datetime.utcnow().isoformat()
    }
    broadcaster.broadcast(payload)
    return {"ok": True, "feature": kpi.FeatureName, "count": kpi.KPI_Count}

@router.get("/trend/{feature_name}", response_model=List[TrendPoint])
def get_trend(feature_name: str, window_minutes: int = 180, db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(minutes=window_minutes)
    q = select(PISKPIHistory).where(
        PISKPIHistory.feature_name == feature_name,
        PISKPIHistory.ts >= since
    ).order_by(PISKPIHistory.ts.asc())
    rows = db.execute(q).scalars().all()
    # If empty, include a baseline point
    if not rows:
        kpi = db.get(PISKPI, feature_name)
        if kpi:
            return [{"ts": datetime.utcnow(), "count": kpi.KPI_Count}]
        return []
    return [{"ts": r.ts, "count": r.count} for r in rows]

@router.get("/category-total/{category_name}")
def category_total(category_name: str, db: Session = Depends(get_db)):
    # Assumes category membership by name prefix or a mapping—replace with your mapping logic if needed.
    # For demo: tools named like "CatA: Tool 1" rollup into category "CatA"
    prefix = f"{category_name}: "
    total = db.execute(
        select(func.sum(PISKPI.KPI_Count)).where(PISKPI.Type == "tool", PISKPI.FeatureName.like(prefix + "%"))
    ).scalar() or 0
    return {"category": category_name, "total": total}
