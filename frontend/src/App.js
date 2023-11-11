import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import PickSong from "./PickSong";
import Song from "./Song";
import TunePlayground from './TunePlayground'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pick-song",
    element: <PickSong />,
  },
  {
    path: "/song/:songId",
    element: <Song />,
  },
  {
    path: "playground",
    element: <TunePlayground />
  }
]);

export default function App() {
  
  return (
    <div className="absolute w-full h-full text-slate-50 bg-orange-500 font-unbounded overflow-y-scroll">
      <RouterProvider router={router} />
    </div>
  );
}
