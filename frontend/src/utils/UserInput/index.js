import KeyboardCapture from "./Keyboard";
import DeviceMotion from "./DeviceMotion";

function UserInput(props) {
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return <>{mobile ? <DeviceMotion /> : <KeyboardCapture />}</>;
}

export default UserInput