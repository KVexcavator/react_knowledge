// import WindowDrawing from './drawing/WindowDrawing'
// import Camera from './video_streams/MyCamera'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import CameraPlayer from './video_streams/CameraPlayer'

function App() {
  // запустить спeрва back_stream
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState("disconnected")
  const [streamVersion, setStreamVersion] = useState(0)
  // задержка создания потока на беке устанавливается эксперементальным путем 
  const delay = 20000

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8001/ws")

    ws.current.onopen = () => {
      console.log("WebSocket connected")
      setStatus("connected")
    }

    ws.current.onclose = () => {
      console.log("WebSocket disconnected")
      setStatus("disconnected")
    }

    ws.current.onmessage = (event) => {
      console.log("WS Message:", event.data)
      if (event.data === "Stream started") {
        setStreamVersion(prev => prev + 1)
      }
    }

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err)
    }

    return () => {
      ws.current?.close();
    };
  }, [])

  const startStream = () => {
    ws.current?.send("start")
    setTimeout(() => {
      setStreamVersion(prev => prev + 1)
    }, delay)
  }

  const stopStream = () => {
    ws.current?.send("stop")
    setStreamVersion(prev => prev + 1)
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h1 className="text-3xl font-bold text-cyan-400 underline">
        Hello WebSocket world!
      </h1>
      <div className="text-sm text-gray-500">WebSocket status: {status}</div>

      <div className="flex gap-4">
        <button
          onClick={startStream}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Start Stream
        </button>
        <button
          onClick={stopStream}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Stop Stream
        </button>
      </div>

      <CameraPlayer key={streamVersion} /> 
    </div>
  )
}

export default App
