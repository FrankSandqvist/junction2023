import { Link } from "react-router-dom";
import Button from "./Button";
import * as Tone from "tone";

export default function Home() {
  return (
    <div className="max-w-[38rem] ml-auto mr-auto flex flex-col items-center h-full overflow-hidden relative">
      <div className="py-7 font-black flex flex-col items-center animate-rock">
        <span className="text-5xl -mb-2 lg:text-7xl ">
          PACE{" "}
          <span className="inline-block scale-150 -translate-x-1 animate-wave">
            🏃
          </span>
        </span>
        <span className="text-5xl lg:text-7xl">YOURSELF </span>
      </div>
      <div className="mb-8 text-center uppercase text-2xl font-black max-w-md">
        Your{" "}
        <span className="drop-shadow-[0_0_5px_rgba(255,255,255,0.80)]">
          favorite tunes
        </span>{" "}
        at your own pace.
      </div>
      <div className="hidden lg:flex flex-col items-center mb-8">
        <p className="mb-4">Get the real experience with your phone:</p>
        <img
          className="rounded-lg mb-4 shadow-lg"
          src="/qr.png"
          width={150}
          height={150}
        />
        <p className="mb-4">...or you can test it on your computer:</p>
      </div>
      <div className="mb-32">
      <Link to="/pick-song">
        <Button onClick={() => {
          try {
            DeviceMotionEvent.requestPermission();
            Tone.start();
          } catch (e) {
            console.error('Exception in PickSong.js', e)
          }
        }}>START SOME SWEATY TUNES</Button>
      </Link>
      </div>
      <div className="w-full h-64 relative">
        <img
          className="grayscale mix-blend-multiply contrast-200 brightness-200 rotate-12 right-0 absolute"
          src="/headphones.png"
          width={200}
          height={200}
        />
        <p className="text-right text-xl font-bold uppercase absolute right-16 lg:right-32 top-2 left-0 lg:text-2xl rotate-12">
          <span className="text-2xl lg:text-4xl">Headphones!</span>
          <br />
          Are strongly recommended
        </p>
      </div>
    </div>
  );
}
