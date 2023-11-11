export default function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className="border border-slate-50 p-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.80)] uppercase hover:scale-105 duration-300 transition-all hover:bg-slate-50 hover:text-orange-600 hover:skew-y-2"
    >
      {props.children}
    </button>
  );
}
