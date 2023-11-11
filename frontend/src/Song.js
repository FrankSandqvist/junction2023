import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "./Button";
import UserInput from "./utils/UserInput";

export function clampNumber(input, min, max) {
  return input < min ? min : input > max ? max : input;
}

export function mapNumber(current, in_min, in_max, out_min, out_max) {
  const mapped =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clampNumber(mapped, out_min, out_max);
}

export default function Song() {
  const params = useParams();

  const cssAnimationDurationRef = useRef();
  const [loading, setLoading] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [cssAnimationDurationLastUpdated, setCssAnimationDurationLastUpdated] =
    useState(0);
  const [cssAnimationDuration, setCssAnimationDuration] = useState(null);
  const [data, setData] = useState(null);
  const [beat, setBeat] = useState(false);

  const [loaded, setLoaded] = useState(0);

  const audio1Ref = useRef();
  const audio2Ref = useRef();
  const audio3Ref = useRef();
  const audio4Ref = useRef();

  const bpm = speed * 6;

  useEffect(() => {
    fetch("https://24aa496694f7e6.lhr.life/get_songs")
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

    //const reverbAmount = ;

    const bassTrackVolume = mapNumber(
      bpm,
      data.song_bpm * 0.2,
      data.song_bpm * 0.4,
      0.4,
      1
    );
    const vocalsTrackVolume = mapNumber(
      bpm,
      data.song_bpm * 0.4,
      data.song_bpm * 0.6,
      0.1,
      1
    );
    const othersTrackVolume = mapNumber(
      bpm,
      data.song_bpm * 0.6,
      data.song_bpm * 0.8,
      0,
      1
    );
    const drumsTrackVolume = mapNumber(
      bpm,
      data.song_bpm * 0.8,
      data.song_bpm,
      0.1,
      1
    );

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
    setBeat(true);
    setTimeout(() => {
      setBeat(false);
    }, (1000 / value) * 10);
    // videoRef.current.playbackRate = Math.max(0.1, value / 10);
  };

  const handleStartUserInput = () => {
    audio1Ref.current.play();
    audio2Ref.current.play();
    audio3Ref.current.play();
    audio4Ref.current.play();
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

        <div className="border border-slate-50 flex flex-col p-4">
          <div className="flex flex-row">
            <div className="w-56">Song is</div>
            <div>{data.song_bpm} BPM</div>
          </div>
          <div className="flex flex-row font-bold">
            <div className="w-56">You're running</div>
            <div className="">{speed * 6} BPM</div>
          </div>
        </div>

        <div className="h-32 relative">
          <div className="relative w-48 h-48"></div>
          <div className="absolute left-8 top-8 w-36 h-36 border-2 border-white/70 rounded-full" />
          <div
            className={`absolute left-8 top-8 w-36 h-36 border-2 border-white rounded-full duration-500 transition-all ${
              1 - Math.min(1, data.song_bpm - speed * 6) > 0.8
                ? "border-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] border-8"
                : ""
            }`}
            style={{
              transform: `scale(${
                1 - Math.min(1, (data.song_bpm - speed * 6) / 100)
              })`,
            }}
          />
        </div>

        <p
          className={`font-tektur font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] shadow-slate-200 text-5xl py-8 ${
            beat % 2 ? "scale-110" : "scale-100"
          }`}
        >
          FASTER
        </p>
        <audio
          key={data.mp3_links[0].song_name}
          controls
          onLoadedData={() => setLoaded((l) => l + 1)}
          ref={audio1Ref}
        >
          <source
            src={`https://24aa496694f7e6.lhr.life${data.mp3_links[0]}`}
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
            src={`https://24aa496694f7e6.lhr.life${data.mp3_links[1]}`}
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
            src={`https://24aa496694f7e6.lhr.life${data.mp3_links[2]}`}
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
            src={`https://24aa496694f7e6.lhr.life${data.mp3_links[3]}`}
            type="audio/ogg"
          ></source>
        </audio>

        <div className="absolute left-4 bottom-4">
          <Link to="/pick-song">
            <Button>Run to another song</Button>
          </Link>
        </div>
      </div>
      <UserInput
        onUpdate={handleUserInputUpdate}
        onClick={handleStartUserInput}
      />
    </div>
  );
}
