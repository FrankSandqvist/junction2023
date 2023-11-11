import { Link } from "react-router-dom";
import Button from "./Button";

export default function PickSong() {
  return (
    <div className="max-w-[38rem] ml-auto mr-auto flex flex-col items-center">
      <p
        className="font-tektur font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] shadow-slate-200 text-5xl py-8 animate-rock"
        style={{ fontStretch: "50%" }}
      >
        PICK A SONG
      </p>

      <Genre title="Techno">
        <SongLink songId="1" title="Song 1" />
        <SongLink songId="2" title="Song 1" />
        <SongLink songId="3" title="Song 1" />
      </Genre>
      <Genre title="Rock">
        <SongLink songId="1" title="Song 1" />
        <SongLink songId="2" title="Song 1" />
        <SongLink songId="3" title="Song 1" />
      </Genre>
      <Link to="/pick-song">Go</Link>
    </div>
  );
}

function Genre(props) {
  return (
    <div className="mb-8 flex flex-col items-center">
      <p className="font-tourney text-2xl mb-2 font-black uppercase">
        {props.title}
      </p>
      {props.children}
    </div>
  );
}

function SongLink(props) {
  return (
    <Link to={`/song/${props.songId}`}>
      <Button>
        <div className="flex flex-row gap-4">
          <div className="w-12 h-12 bg-gray"></div>
          {props.title}
          <img src="/play.svg" width={40} height={40} />
        </div>
      </Button>
    </Link>
  );
}
