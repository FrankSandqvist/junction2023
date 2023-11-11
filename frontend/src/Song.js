import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "./Button";
import UserInput from "./utils/UserInput";

export default function Song() {
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [data, setData] = useState(null);
  

  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    fetch("https://011a660d1d3d8f.lhr.life/get_songs")
      .then((res) => res.json())
      .then((json) => {
        setData(json.find((d) => d.song_name === params.songId));
        setLoading(false);
      });
  }, []);

  const videoRef = useRef();

  useEffect(() => {
    if (loading) return;
    videoRef.current.play();
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    videoRef.current.playbackRate = speed;
  }, [loading, speed]);

  useEffect(() => {
    if (loaded < 4) return;

    setTimeout(() => {
      document.querySelectorAll("audio").forEach((e) => e.play());
    }, 2000);
  }, [loaded]);

  if (loading) return <div>Loading</div>;

  console.log(loaded);

  const handleUserInputUpdate = ({ value }) => {
    console.log(value)
    videoRef.current.playbackRate = Math.max(0.05, value / 10);
  }

  return (
    <div className="flex flex-row items-stretch h-full w-full">

      <div className="hidden w-1/2 lg:block relative overflow-hidden">
        <video
          src="/run.mp4"
          ref={videoRef}
          autoPlay
          playsInline
          loop
          className="animate-run w-full"
          style={{ animationDuration: `${1 - speed / 10}s` }}
        />
        <div className="bg-black/50 absolute top-0 left-0 right-0 bottom-0 z-50 flex flex-col items-center justify-center text-center p-16">
          <p className="text-3xl mb-4">
            Since you are testing this on your computer...
          </p>
          <p className="mb-8">
            ...you can simulate running by tapping the space bar!
          </p>
          <div className="border-2 border-b-4 border-white uppercase text-white px-24 py-2 rounded-lg">
            SPACE
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center relative">
        <div
          className="rounded-b-lg p-4 flex flex-col gap-4 relative w-full pt-24 mix-blend-screen"
          style={{
            backgroundImage: `url(${data.song_cover_link})`,
          }}
        >
          <p className="uppercase -mb-4 z-10">
            Now playing <span className="ml-2">▶</span>
          </p>
          <p className="text-2xl z-10">{data.song_name}</p>
          <div
            className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center grayscale  contrast-200 brightness-200"
            style={{
              backgroundImage: `url(${"https://www.juxtapoz.com/images/Evan%20Pricco/2019/7July2019/White_Stripes_Elephant.jpg"})`,
            }}
          ></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-black"></div>
        </div>

        <input
          type="range"
          min="0.1"
          max="10"
          onChange={(e) => setSpeed(e.target.value)}
          step={0.05}
          className="mb-20"
        />

        <p
          className="font-tektur font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] shadow-slate-200 text-5xl py-8 animate-rock"
          style={{
            fontStretch: "50%",
            animationDuration: `${1 - speed / 10}s`,
          }}
        >
          RUNNING
        </p>
        {data.mp3_links.map((mp3) => (
        <audio
          key={mp3.song_name}
          controls
          onLoadedData={() => setLoaded((l) => l + 1)}
        >
          <source
            src={`https://56526f9c0c2158.lhr.life${mp3}`}
            type="audio/ogg"
          ></source>
        </audio>
      ))}

        <div className="absolute left-4 bottom-4">
          <Link to="/pick-song">
            <Button>Run to another song</Button>
          </Link>
        </div>
      </div>
      <UserInput onUpdate={handleUserInputUpdate} />
    </div>
  );
}
