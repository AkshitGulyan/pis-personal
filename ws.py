from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json

router = APIRouter(tags=["ws"])

class Broadcaster:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    def prune(self):
        self.active = [ws for ws in self.active if not ws.client_state.name == "DISCONNECTED"]

    async def send_json(self, message: dict):
        self.prune()
        dead = []
        for ws in self.active:
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                dead.append(ws)
        for d in dead:
            self.disconnect(d)

    def broadcast(self, message: dict):
        # scheduled in lifespan context via background task in main
        import asyncio
        asyncio.create_task(self.send_json(message))

broadcaster = Broadcaster()

@router.websocket("/ws/kpi")
async def ws_kpi(websocket: WebSocket):
    await broadcaster.connect(websocket)
    try:
        while True:
            # (optional) receive pings/messages from client
            await websocket.receive_text()
    except WebSocketDisconnect:
        broadcaster.disconnect(websocket)
