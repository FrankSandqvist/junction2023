import { useEffect, useState } from "react";

const FootstepsCounter = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isDeviceMotionSupported, setIsDeviceMotionSupported] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let steps = 0;

    const handleDeviceMotion = (event) => {
      const { acceleration } = event;

      if (acceleration && Math.abs(acceleration.x) > 10) {
        // Basic step detection based on acceleration
        steps++;
        setStepCount(steps);
      }
    };

    if ("DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", handleDeviceMotion);
      setIsDeviceMotionSupported(true);
    } else {
      setIsDeviceMotionSupported(false);
    }

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
  };

  return (
    <div>
      <h1>Footsteps Counter</h1>
      {isDeviceMotionSupported ? (
        <div>
          <p>Step Count: {stepCount}</p>
          {startTime ? (
            <p>Average steps per minute: {averageStepsPerMinute.toFixed(2)}</p>
          ) : (
            <button onClick={startTracking}>Start Tracking</button>
          )}
        </div>
      ) : (
        <p>DeviceMotion API is not supported on this device.</p>
      )}
    </div>
  );
};

export default FootstepsCounter;
