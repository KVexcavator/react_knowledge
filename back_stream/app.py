from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os
import glob
import asyncio

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

HLS_DIR = "./stream/videos"
app.mount("/hls", StaticFiles(directory=HLS_DIR), name="hls")

ffmpeg_process = None
connected_clients = set()

def get_ffmpeg_command():
  return [
    "ffmpeg",
    "-f", "v4l2",
    "-framerate", "15",
    "-video_size", "640x480",
    "-i", "/dev/video0",
    "-f", "pulse", "-i", "default",
    "-vf", "scale=w=1280:h=720:force_original_aspect_ratio=decrease",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-tune", "zerolatency",
    "-c:a", "aac",
    "-ar", "44100",
    "-b:a", "128k",
    "-f", "hls",
    "-hls_time", "0.5",
    "-hls_list_size", "2",
    "-hls_flags", "delete_segments+omit_endlist",
    f"{HLS_DIR}/stream.m3u8"
  ]

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
  await websocket.accept()
  connected_clients.add(websocket)
  try:
    while True:
      data = await websocket.receive_text()
      print(f"WebSocket received: {data}")
      if data == "start":
        await start_stream()
        await websocket.send_text("Stream started")
      elif data == "stop":
        await stop_stream()
        await websocket.send_text("Stream stopped")
  except WebSocketDisconnect:
    connected_clients.remove(websocket)
    print("Client disconnected")

async def start_stream():
  global ffmpeg_process
  if ffmpeg_process and ffmpeg_process.poll() is None:
    return
  os.makedirs(HLS_DIR, exist_ok=True)
  ffmpeg_process = subprocess.Popen(get_ffmpeg_command())

async def stop_stream():
  global ffmpeg_process
  if ffmpeg_process:
    ffmpeg_process.terminate()
    ffmpeg_process.wait()
    ffmpeg_process = None

  # Очистка HLS директории
  for f in glob.glob(f"{HLS_DIR}/*"):
    try:
      os.remove(f)
    except Exception as e:
      print(f"Ошибка при удалении {f}: {e}")

@app.get("/")
def root():
  return FileResponse("index.html")

@app.on_event("startup")
def clean_on_startup():
  print("Очистка HLS директории при запуске сервера...")
  for f in glob.glob(f"{HLS_DIR}/*"):
    try:
      os.remove(f)
    except Exception as e:
      print(f"Ошибка при удалении {f}: {e}")
