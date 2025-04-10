import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function CameraPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("http://localhost:8001/hls/stream.m3u8");
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = "http://localhost:8001/hls/stream.m3u8";
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <video ref={videoRef} controls autoPlay className="w-full rounded-xl shadow-lg" />
    </div>
  );
}
