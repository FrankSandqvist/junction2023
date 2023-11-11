import UserInput from "./utils/UserInput/index";

function App() {
  const handleUserInputUpdate = (e) => {
    console.log("UserInput: onUpdate", e);
  };

  return (
    <div className="absolute w-full h-full flex items-center justify-center">
      <header className=" w-64 h-64 bg-fuchsia-800 text-fuchsia-100 font-bold rounded-lg shadow-lg shadow-fuchsia-400 flex items-center justify-center">
        Woot!
      </header>
      <UserInput onUpdate={handleUserInputUpdate} />
    </div>
  );
}

export default App;
