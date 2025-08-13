from fastapi import APIRouter, Query
import markdown

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

@router.get("")
def chatbot(q: str = Query(..., min_length=1)):
    # Stub echo. Replace with your real bot call.
    md = f"**You asked:** {q}\n\nHere's a *placeholder* response."
    html = markdown.markdown(md)
    return {"markdown": md, "html": html}
