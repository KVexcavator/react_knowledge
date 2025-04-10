from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os

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

@app.post("/start-stream")
def start_stream(background_tasks: BackgroundTasks):
  global ffmpeg_process

  if ffmpeg_process and ffmpeg_process.poll() is None:
    return {"status": "already running"}

  os.makedirs(HLS_DIR, exist_ok=True)

  command = [
    "ffmpeg",
    "-f", "v4l2",
    "-framerate", "15",
    "-video_size", "640x480",
    "-i", "/dev/video0",
    "-f", "pulse", "-i", "default",  # захват звука
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

  ffmpeg_process = subprocess.Popen(command)
  return {"status": "started"}

@app.post("/stop-stream")
def stop_stream():
  global ffmpeg_process
  if ffmpeg_process:
    ffmpeg_process.terminate()
    ffmpeg_process.wait()
    ffmpeg_process = None
  return {"status": "stopped"}

@app.get("/")
def root():
  return FileResponse("index.html")
