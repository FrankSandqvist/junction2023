import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "./Button";
import UserInput from "./utils/UserInput";
import AudioPlayer from "./AudioPlayer";

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
  const [songsLoading, setSongsLoading] = useState(true);

  const [tracks, setTracks] = useState([]);

  const [tracksParams, setTrackParams] = useState({});

  const bpm = speed * 6;

  useEffect(() => {
    console.log("Song.js: Inititalized");
    fetch("https://5d45eb26f5aaa2.lhr.life/get_songs")
      .then((res) => res.json())
      .then((json) => {
        setData(json.find((d) => d.song_name === params.songId));

        const finalTracks = json.find(
          (d) => d.song_name === params.songId
        )?.mp3_links;
        setTracks(
          finalTracks.map((v) => `https://5d45eb26f5aaa2.lhr.life${v}`)
        );
        setLoading(false);
      });

    setCssAnimationDurationLastUpdated(+new Date());

    return () => {
      console.log("Song.js: Unmounting");
    };
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
      data.song_bpm * 0.5,
      data.song_bpm * 0.8,
      0,
      1
    );
    const drumsTrackVolume = mapNumber(
      bpm,
      data.song_bpm * 0.7,
      data.song_bpm,
      0.1,
      1
    );

    setTrackParams({
      volume: [
        vocalsTrackVolume,
        drumsTrackVolume, 
        bassTrackVolume,
        othersTrackVolume,
      ],
      reverb: drumsTrackVolume,
      wet: bassTrackVolume,
      playbackRate: drumsTrackVolume,
    });

    console.log(
      vocalsTrackVolume,
      bassTrackVolume,
      othersTrackVolume,
      drumsTrackVolume
    );
  }, [loading, speed]);

  if (loading) return <div>Loading your tunes</div>;

  const handleUserInputUpdate = ({ value }) => {
    // console.log(value)
    setSpeed(Math.min(value, data.song_bpm / 5));
    // videoRef.current.playbackRate = Math.max(0.1, value / 10);
  };

  const handleBeat = () => {
    setBeat((b) => !b);
  };

  const handleSongStart = () => {
    setSongsLoading(false);
  };

  const bpmDelta = bpm - data.song_bpm;

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
          className="rounded-b-lg p-4 flex flex-col gap-4 relative w-full pt-24 mb-16 mix-blend-screen"
          style={{
            backgroundImage: `url(${data.song_cover_link})`,
          }}
        >
          <p className="uppercase -mb-4 z-10">
            Now playing <span className="ml-2">▶</span>
          </p>
          <p className="text-2xl z-10">
            {data.song_name} by {data.artist}
          </p>
          <div
            className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center grayscale  contrast-200 brightness-200"
            style={{
              backgroundImage: `url(${data.song_cover_link})`,
            }}
          ></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-black"></div>
        </div>

        {/* <input
          type="range"
          min="0.1"
          max="10"
          onChange={(e) => setSpeed(e.target.value)}
          step={0.05}
          className="mb-20"
        /> */}

        <div className="border border-slate-50 flex flex-col p-4 mb-8">
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
          <div
            className="absolute left-6 top-6 w-36 h-36 border-2 border-white/70 rounded-full animate-rock"
            style={{ animationDuration: `${60 / data.song_bpm}s` }}
          />
          <div
            className={`absolute left-6 top-6 w-36 h-36 border-2 border-white rounded-full duration-500 transition-all ${
              bpmDelta > -15 && bpmDelta < 15
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
          className={`font-tektur font-black  shadow-slate-200 text-3xl lg:text-5xl duration-300 transition-transform lg:-mt-14 -mt-12 mb-32 ${
            beat % 2 ? "scale-110" : "scale-100"
          }`}
          style={{
            filter: `drop-shadow(0 0 10px ${
              bpmDelta < -40
                ? "red"
                : bpmDelta < -20
                ? "white"
                : bpmDelta > 20
                ? "red"
                : "white"
            })`,
          }}
        >
          {songsLoading
            ? "Loading song..."
            : bpmDelta < -40
            ? "FASTER!"
            : bpmDelta < -20
            ? "OK!"
            : bpmDelta > 20
            ? "SLOW DOWN"
            : "PERFECT!!!!"}
        </p>

        <div className="absolute left-4 bottom-4">
          <Link to="/pick-song">
            <Button>Run to another song</Button>
          </Link>
        </div>
      </div>
      {tracks?.length && (
        <AudioPlayer
          tracks={tracks}
          params={tracksParams}
          onStart={handleSongStart}
        />
      )}
      <UserInput onBeat={handleBeat} onUpdate={handleUserInputUpdate} />
    </div>
  );
}
