import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "./Button";
import UserInput from "./utils/UserInput";

export default function Song() {
  const params = useParams();

  const cssAnimationDurationRef = useRef();
  const [loading, setLoading] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [cssAnimationDurationLastUpdated, setCssAnimationDurationLastUpdated] =
    useState(0);
  const [cssAnimationDuration, setCssAnimationDuration] = useState(null);
  const [data, setData] = useState(null);

  const [loaded, setLoaded] = useState(0);

  const audio1Ref = useRef();
  const audio2Ref = useRef();
  const audio3Ref = useRef();
  const audio4Ref = useRef();

  useEffect(() => {
    fetch("https://011a660d1d3d8f.lhr.life/get_songs")
      .then((res) => res.json())
      .then((json) => {
        setData(json.find((d) => d.song_name === params.songId));
        setLoading(false);
      });

    setCssAnimationDurationLastUpdated(+new Date());
  }, []);

  const videoRef = useRef();

  useEffect(() => {
    const duration = Math.min(2, Math.max(0.3, 2 - speed / 10));
    setCssAnimationDuration(duration);

    clearTimeout(cssAnimationDurationRef.current);
    if (speed === 0) {
      setCssAnimationDuration(null);
      cssAnimationDurationRef.current = setTimeout(() => {
        setCssAnimationDurationLastUpdated(+new Date());
      }, 1000);
      return;
    }

    // console.log("setting", duration)
    cssAnimationDurationRef.current = setTimeout(() => {
      setCssAnimationDurationLastUpdated(+new Date());
    }, duration * 1000 + ((duration * 1000) % 500));
  }, [cssAnimationDurationLastUpdated]);

  useEffect(() => {
    if (loading) return;
    videoRef.current.play();
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    videoRef.current.playbackRate = Math.max(0.1, speed / 6);

    const bpm = speed * 10;
    const bpmDelta = data.song_bpm - bpm;

    //  const reverbAmount = ;

    const vocalsTrackVolume = Math.min(1, 0.3 + Math.max(0, 1 - bpmDelta / 50));;
    const bassTrackVolume = Math.min(1, 0 + Math.max(0, 1 - bpmDelta / 50));
    const othersTrackVolume = Math.min(1, 0 + Math.max(0, 1 - bpmDelta / 30));
    const drumsTrackVolume = Math.min(1, 0 + Math.max(0, 1 - bpmDelta / 10));

    audio1Ref.current.volume = vocalsTrackVolume;
    audio2Ref.current.volume = bassTrackVolume;
    audio3Ref.current.volume = othersTrackVolume;
    audio4Ref.current.volume = drumsTrackVolume;

    console.log(
      vocalsTrackVolume,
      bassTrackVolume,
      othersTrackVolume,
      drumsTrackVolume
    );
  }, [loading, speed]);

  useEffect(() => {
    if (loaded < 4) return;

    setTimeout(() => {
      audio1Ref.current.play();
      audio2Ref.current.play();
      audio3Ref.current.play();
      audio4Ref.current.play();
    }, 2000);
  }, [loaded]);

  if (loading) return <div>Loading</div>;

  const handleUserInputUpdate = ({ value }) => {
    // console.log(value)
    setSpeed(value);
    // videoRef.current.playbackRate = Math.max(0.1, value / 10);
  };

  return (
    <div className="flex flex-row items-stretch h-full w-full">
      <div className="hidden w-1/2 lg:block relative overflow-hidden">
        <video
          src="/run.mp4"
          ref={videoRef}
          autoPlay
          playsInline
          loop
          className="w-full animate-run"
          style={{ animationDuration: `${cssAnimationDuration ?? 1000}s` }}
        />
        {speed === 0 ? (
          <div className="bg-black/50 absolute top-0 left-0 right-0 bottom-0 z-50 flex flex-col items-center justify-center text-center p-16 backdrop-blur-lg">
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
        ) : null}
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
              backgroundImage: `url(${data.song_cover_link})`,
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

        <p>{speed * 10} BPM</p>

        <p
          className="font-tektur font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] shadow-slate-200 text-5xl py-8 animate-rock"
          style={{
            fontStretch: "50%",
            animationDuration: speed ? `${(50 - speed) * 0.01666}s` : "0s",
          }}
        >
          RUNNING
        </p>
        <audio
          key={data.mp3_links[0].song_name}
          controls
          onLoadedData={() => setLoaded((l) => l + 1)}
          ref={audio1Ref}
        >
          <source
            src={`https://011a660d1d3d8f.lhr.life${data.mp3_links[0]}`}
            type="audio/ogg"
          ></source>
        </audio>
        <audio
          key={data.mp3_links[1].song_name}
          controls
          onLoadedData={() => setLoaded((l) => l + 1)}
          ref={audio2Ref}
        >
          <source
            src={`https://011a660d1d3d8f.lhr.life${data.mp3_links[1]}`}
            type="audio/ogg"
          ></source>
        </audio>
        <audio
          key={data.mp3_links[2].song_name}
          controls
          onLoadedData={() => setLoaded((l) => l + 1)}
          ref={audio3Ref}
        >
          <source
            src={`https://011a660d1d3d8f.lhr.life${data.mp3_links[2]}`}
            type="audio/ogg"
          ></source>
        </audio>
        <audio
          key={data.mp3_links[3].song_name}
          controls
          onLoadedData={() => setLoaded((l) => l + 1)}
          ref={audio4Ref}
        >
          <source
            src={`https://011a660d1d3d8f.lhr.life${data.mp3_links[3]}`}
            type="audio/ogg"
          ></source>
        </audio>

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
