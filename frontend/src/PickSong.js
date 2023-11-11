import { Link } from "react-router-dom";
import Button from "./Button";
import { useEffect, useState } from "react";

export default function PickSong() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://56526f9c0c2158.lhr.life/get_songs")
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
      <p
        className="font-tektur font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] shadow-slate-200 text-5xl py-8 animate-rock text-center"
        style={{ fontStretch: "50%" }}
      >
        PICK A SONG
      </p>

      {data ? (
        <>
          <Genre title="Slow-paced">
            {data[0].map((d) => (
              <SongLink
                songId={d.song_name}
                title={d.song_name}
                artist={d.artist}
                image={d.song_cover_link}
              />
            ))}
          </Genre>
          <Genre title="Medium-paced">
            {data[1].map((d) => (
              <SongLink
                songId={d.song_name}
                title={d.song_name}
                artist={d.artist}
                image={d.song_cover_link}
              />
            ))}
          </Genre>
          <Genre title="High-paced">
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
          <div>Internet has been struggling a bit this Junction... 😀</div>
        </div>
      )}
    </div>
  );
}

function Genre(props) {
  return (
    <div className="mb-8 flex flex-col items-stretch">
      <div className="font-tourney text-xl lg:text-2xl mb-2 font-black uppercase flex lg:justify-center gap-4 items-center">
        <div className=" h-1 bg-slate-50/50 w-16 hidden lg:block"></div>
        {props.title}
        <div className=" h-1 bg-slate-50/50 flex-grow"></div>
      </div>
      {props.children}
    </div>
  );
}

function SongLink(props) {
  return (
    <Link to={`/song/${props.songId}`}>
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
