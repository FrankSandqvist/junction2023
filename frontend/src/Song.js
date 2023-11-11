import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function Song() {
  const params = useParams();

  const [speed, setSpeed] = useState(0);
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.play();
  }, []);

  useEffect(() => {
    videoRef.current.playbackRate = speed;
  }, [speed]);

  return (
    <div className="flex flex-row items-stretch h-full">
      <div className="hidden w-1/2 lg:block relative">
        <div className="absolute left-4 top-4 bottom-4 right-4 bg-white rounded-xl overflow-hidden">
          <video
            src="/Untitled.mp4"
            ref={videoRef}
            autoPlay
            playsInline
            loop
            className="animate-run"
            style={{ animationDuration: `${1 - speed / 10}s` }}
          />
        </div>
      </div>
      <div className="w-1/2">
      <input
          type="range"
          min="0.1"
          max="10"
          onChange={(e) => setSpeed(e.target.value)}
          step={0.05}
          className="mb-20"
        />
        <p className="font-tektur drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] shadow-slate-200 text-6xl py-8">
          {params.songId}
        </p>
      </div>
    </div>
  );
}
