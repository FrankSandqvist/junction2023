import React, { useEffect, useState } from "react";

const KeyboardCapture = ({ onUpdate,onBeat}) => {
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let keypressesTimestamps = [];
    let stepsCounterInterval = null;
    const handleKeyDown = (event) => {
      if (event.keyCode !== 32) {
        return;
      }
      if (!startTime) {
        setStartTime(Date.now());
      }
      onBeat()
      keypressesTimestamps.push(Date.now())
    };

    window.addEventListener("keydown", handleKeyDown);

    stepsCounterInterval = setInterval(() => {
      // console.log('keypressesTimestamps', keypressesTimestamps)
      const filteredKeypressesTimestamps = keypressesTimestamps.filter(v => v >= Date.now() - 10000);
      keypressesTimestamps = [...filteredKeypressesTimestamps];
      onUpdate({ value: filteredKeypressesTimestamps.length })
    }, 250)

    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(stepsCounterInterval);
    };
  }, []);


  return (
    <></>
  );
};

export default KeyboardCapture;
