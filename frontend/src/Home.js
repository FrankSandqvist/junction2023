import { Link } from "react-router-dom";
import Button from "./Button";

export default function Home() {
  return (
      <div className="max-w-[38rem] ml-auto mr-auto flex flex-col items-center h-full overflow-hidden relative">
        <div className="py-7 font-black flex flex-col items-center animate-rock">
          <span className="text-5xl -mb-2 lg:text-7xl ">SWEATY</span>
          <span className="text-5xl lg:text-7xl">
            TUNES{" "}
            <span className="inline-block scale-150 -translate-x-1 animate-wave">💦</span>
          </span>
        </div>
        <div className="mb-8 text-center">Your favorite tunes as your workout partner.</div>
        <div className="absolute w-full h-64 bottom-0">
          <div className="grayscale mix-blend-multiply contrast-200 brightness-200 rotate-6 right-0 absolute">
            <img src="/headphones.png" width={200} height={200} />
          </div>
          <p className="text-right text-xl font-bold uppercase absolute right-16 lg:right-32 top-2 left-0 lg:text-2xl ">
            <span className="text-2xl lg:text-4xl">Headphones</span><br/>strongly recommended
          </p>
        </div>
        <Link to="/pick-song">
          <Button>START SOME SWEATY TUNES</Button>
        </Link>
      </div>
  );
}
