import { useEffect, useState } from "react";
import Button from "../../Button";

let lastEvent = new Date();

const FootstepsCounter = (props) => {
  const [isDeviceMotionSupported, setIsDeviceMotionSupported] = useState(false);

  useEffect(() => {
    let keypressesTimestamps = [];
    let stepsCounterInterval = null;

    const handleDeviceMotion = (event) => {
      const { acceleration } = event;
      // if (acceleration && Math.abs(acceleration.x) > 10) {
      //   keypressesTimestamps.push(Date.now());
      // }
      if (
        acceleration &&
        Math.abs(acceleration.x) +
          Math.abs(acceleration.y) +
          Math.abs(acceleration.z) / 3 >
          10 &&
        lastEvent < new Date() - 70
      ) {
        keypressesTimestamps.push(Date.now());
        props.onBeat();
        lastEvent = new Date();
      }
    };

    if ("DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", handleDeviceMotion);
      setIsDeviceMotionSupported(true);
    } else {
      setIsDeviceMotionSupported(false);
    }

    stepsCounterInterval = setInterval(() => {
      // console.log('keypressesTimestamps', keypressesTimestamps)
      const filteredKeypressesTimestamps = keypressesTimestamps.filter(
        (v) => v >= Date.now() - 1 * 5000
      );
      keypressesTimestamps = [...filteredKeypressesTimestamps];
      props.onUpdate({ value: filteredKeypressesTimestamps.length });
    }, 100);

    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
      clearInterval(stepsCounterInterval);
    };
  }, []);

  return (
    <></>//<Button
    //  onClick={() => {
    //    DeviceMotionEvent.requestPermission();
    //    props.onClick();
    //  }}
    //>
    //  Start
    //</Button>
  );
};

export default FootstepsCounter;
