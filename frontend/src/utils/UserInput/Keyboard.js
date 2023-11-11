import React, { useEffect, useState } from "react";

const KeyboardCapture = ({ onUpdate }) => {
  const [pressedKey, setPressedKey] = useState(null);
  const [keyPresses, setKeyPresses] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let avgCalcInterval = null;
    const handleKeyDown = (event) => {
      if (event.keyCode !== 32) {
        return;
      }
      if (!startTime) {
        setStartTime(Date.now());
      }
      setPressedKey(event.keyCode);
      setKeyPresses((prev) => prev + 1);
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startTime]);

  // Calculate average key presses per minute
  const calculateAverageKeyPressesPerMinute = () => {
    if (!startTime || keyPresses < 10) {
      return 0;
    }
    const elapsedTimeInMinutes = (Date.now() - startTime) / 6000; // Convert milliseconds to minutes
    // console.log(">", startTime, elapsedTimeInMinutes, keyPresses)
    return keyPresses / elapsedTimeInMinutes;
  };

  const averageKeyPressesPerMinute = calculateAverageKeyPressesPerMinute();

  useEffect(() => {
    if (!averageKeyPressesPerMinute) {
      return;
    }
    const value =
      averageKeyPressesPerMinute > 300
        ? 100
        : averageKeyPressesPerMinute;
    onUpdate({ value });
  }, [averageKeyPressesPerMinute, onUpdate]);

  return (
    <></>
    // <div>
    //   <h1>Keyboard Input Capture</h1>
    //   <p>Average key presses per minute: {averageKeyPressesPerMinute.toFixed(2)}</p>
    // </div>
  );
};

export default KeyboardCapture;
