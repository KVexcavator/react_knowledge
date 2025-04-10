# pip install opencv-python
import cv2
from http.server import BaseHTTPRequestHandler, HTTPServer

class VideoHandler(BaseHTTPRequestHandler):
  def do_GET(self):
    if self.path != '/video':
      self.send_error(404)
      return

    self.send_response(200)
    self.send_header('Content-type', 'multipart/x-mixed-replace; boundary=frame')
    self.end_headers()

    cap = cv2.VideoCapture(0)  # 0 = default camera

    while True:
      ret, frame = cap.read()
      if not ret:
        break

      _, jpeg = cv2.imencode('.jpg', frame)
      self.wfile.write(b"--frame\r\n")
      self.wfile.write(b"Content-Type: image/jpeg\r\n\r\n")
      self.wfile.write(jpeg.tobytes())
      self.wfile.write(b"\r\n")

server = HTTPServer(('0.0.0.0', 8002), VideoHandler)
print("Server started at http://localhost:8002/video")
server.serve_forever()
