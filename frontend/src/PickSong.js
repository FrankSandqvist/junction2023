import { Link } from "react-router-dom";
import Button from "./Button";
import { useEffect, useState } from "react";
import * as Tone from "tone";

export default function PickSong() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://24aa496694f7e6.lhr.life/get_songs")
      .then((res) => res.json())
      .then((json) => {
        setData([
          json.filter((j) => j.song_bpm <= 100),
          json.filter((j) => j.song_bpm > 100 && j.song_bpm <= 140),
          json.filter((j) => j.song_bpm > 140),
        ]);
      });
  }, []);

  return (
    <div className="max-w-[38rem] ml-auto mr-auto flex flex-col items-stretch px-4">
      <p className="font-tektur font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] shadow-slate-200 text-5xl py-8 animate-rock text-center uppercase">
        Your Library
      </p>
      <p className="mb-16 text-center">Which pace are you going for today?</p>

      {data ? (
        <>
          <Genre
            title="Slow-paced"
            shuffleLink={`/song/${
              data[0][Math.floor(Math.random() * data[0].length)].song_name
            }`}
          >
            {data[0].map((d) => (
              <SongLink
                songId={d.song_name}
                title={d.song_name}
                artist={d.artist}
                image={d.song_cover_link}
              />
            ))}
          </Genre>
          <Genre
            title="Medium-paced"
            shuffleLink={`/song/${
              data[1][Math.floor(Math.random() * data[1].length)].song_name
            }`}
          >
            {data[1].map((d) => (
              <SongLink
                songId={d.song_name}
                title={d.song_name}
                artist={d.artist}
                image={d.song_cover_link}
              />
            ))}
          </Genre>
          <Genre
            title="High-paced"
            shuffleLink={`/song/${
              data[2][Math.floor(Math.random() * data[2].length)].song_name
            }`}
          >
            {data[2].map((d) => (
              <SongLink
                songId={d.song_name}
                title={d.song_name}
                artist={d.artist}
                image={d.song_cover_link}
              />
            ))}
          </Genre>
        </>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <div className="text-lg font-bold">Loading some tunes...</div>
          <div>Internet has been struggling a bit this Junction... <span className="text-lg">😀</span></div>
        </div>
      )}
    </div>
  );
}

function Genre(props) {
  return (
    <div className="mb-8 flex flex-col items-stretch">
      <div className="font-tourney text-xl lg:text-2xl mb-2 font-black uppercase flex lg:justify-center items-center">
        {props.title}
        <div className=" h-1 bg-slate-50/50 flex-grow ml-4"></div>
        <Link to={props.shuffleLink}>
          <div className="border-slate-50/50 border-4 text-slate-50 p-2 text-lg duration-300 transition-colors hover:text-orange-500 hover:border-slate-50 hover:bg-slate-50">
            Shuffle ▶
          </div>
        </Link>
      </div>
      {props.children}
    </div>
  );
}

function SongLink(props) {
  return (
    <Link to={`/song/${props.songId}`} onClick={() => {
      try {
        DeviceMotionEvent.requestPermission();
        Tone.start();
      } catch (e) {
        console.error('Exception in PickSong.js', e)
      }
    }}>
      <div className="p-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.80)] uppercase hover:scale-105 duration-300 transition-all hover:bg-slate-50 flex flex-row items-center hover:text-orange-600 hover:skew-y-2">
        <div
          className="w-12 h-12 bg-cover scale-125 lg:-translate-x-6 mr-4"
          style={{ backgroundImage: `url(${props.image})` }}
        ></div>
        <div className="flex-grow flex flex-col items-start">
          <p className="text-sm">{props.artist}</p>
          <p className="text-md lg:text-lg">{props.title}</p>
        </div>
        <span className="ml-8 text-2xl">▶</span>
      </div>
    </Link>
  );
}
