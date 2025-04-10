import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export default function CameraPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('Компонент перерендерился')
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(`http://localhost:8001/hls/stream.m3u8?nocache=${Date.now()}`)
      hls.attachMedia(video)
      return () => {
        hls.destroy(); // <- важно: убираем старый инстанс
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = `http://localhost:8001/hls/stream.m3u8?nocache=${Date.now()}`

    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <video ref={videoRef} controls autoPlay className="w-full rounded-xl shadow-lg" />
    </div>
  );
}
