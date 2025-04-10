import {  } from 'react'
import './App.css'
// import WindowDrawing from "./WindowDrawing"
// import Camera from './video_streams/MyCamera'
import CameraPlayer from './video_streams/CameraPlayer'

function App() {
  const startStream = async () => {
    try {
      const res = await fetch("http://localhost:8001/start-stream", {
        method: "POST",
      });
      const json = await res.json();
      console.log(json);
    } catch (err) {
      console.error("Ошибка запуска трансляции", err);
    }
  };

  const stopStream = async () => {
    try {
      const res = await fetch("http://localhost:8001/stop-stream", {
        method: "POST",
      });
      const json = await res.json();
      console.log(json);
    } catch (err) {
      console.error("Ошибка остановки трансляции", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h1 className="text-3xl font-bold text-cyan-400 underline">
        Hello world!
      </h1>

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

      <CameraPlayer />
    </div>
  );
}

export default App;