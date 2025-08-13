from .db import Base, engine, SessionLocal
from .models import PISKPI

TOOLS = [
    "Product Engineering: Tool 1",
    "Product Engineering: Tool 2",
    "Product Engineering: Tool 3",
    "Product Engineering: Tool 4",
    "Efficiency: Tool 1",
    "Efficiency: Tool 2",
    "Efficiency: Tool 3",
    "Efficiency: Tool 4",
    "Management: Tool 1",
    "Management: Tool 2",
    "Management: Tool 3",
    "Management: Tool 4",
]

CATEGORIES = ["Product Engineering", "Efficiency", "Management"]

def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    # insert categories
    for c in CATEGORIES:
        if not db.get(PISKPI, c):
            db.add(PISKPI(FeatureName=c, KPI_Count=0, Type="category"))
    # insert tools
    for t in TOOLS:
        if not db.get(PISKPI, t):
            db.add(PISKPI(FeatureName=t, KPI_Count=0, Type="tool"))
    db.commit()
    db.close()

if __name__ == "__main__":
    run()
