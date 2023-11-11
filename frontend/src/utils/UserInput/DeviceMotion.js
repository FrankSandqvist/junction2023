import { useEffect, useState } from "react";

const FootstepsCounter = ({ onUpdate }) => {
  const [stepCount, setStepCount] = useState(0);
  const [isDeviceMotionSupported, setIsDeviceMotionSupported] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  let steps = 0;

  const handleDeviceMotion = (event) => {
    const { acceleration } = event;

    if (acceleration && Math.abs(acceleration.x) > 10) {
      // Basic step detection based on acceleration
      steps++;
      setStepCount(steps);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, []);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
      }, 100); // Update every second

      return () => clearInterval(interval);
    }
  }, [startTime]);

  const calculateAverageStepsPerMinute = () => {
    if (elapsedTime > 0 && stepCount > 0) {
      return (stepCount / elapsedTime) * 60; // Steps per minute
    }
    return 0;
  };

  const averageStepsPerMinute = calculateAverageStepsPerMinute();

  const startTracking = () => {
    setStartTime(Date.now());
    DeviceMotionEvent.requestPermission();

    if ("DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", handleDeviceMotion);
      setIsDeviceMotionSupported(true);
    } else {
      setIsDeviceMotionSupported(false);
    }
  };

  useEffect(() => {
    onUpdate({ value: averageStepsPerMinute });
  }, [averageStepsPerMinute, onUpdate]);

  return (
    <div>
      <h1>Footsteps Counter</h1>
      <button onClick={startTracking}>Start Tracking</button>

      {isDeviceMotionSupported ? (
        <div>
          <p>Step Count: {stepCount}</p>
          {startTime ? (
            <p>Average steps per minute: {averageStepsPerMinute.toFixed(2)}</p>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <p>DeviceMotion API is not supported on this device.</p>
      )}
    </div>
  );
};

export default FootstepsCounter;
