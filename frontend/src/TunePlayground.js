import React, { useState, useEffect } from "react";
import * as Tone from "tone";

const ReverbComponent = () => {
  const [reverb, setReverb] = useState(new Tone.Reverb());
  const [player, setPlayer] = useState(new Tone.Player().toDestination());
  const [reverbDebugValue, setReverbDebugValue] = useState();
  const [wetDebugValue, setWetDebugValue] = useState();
  const [playbackRate, setPlaybackRate] = useState();

  Tone.start();

  useEffect(() => {
    // Load the player with a URL to your audio file
    // player.load("/sounds/abba.mp3");
    // Connect the player to the reverb
    player.connect(reverb);
    // Connect the reverb to the destination
    reverb.toDestination();
    console.log(player);
    // Cleanup on unmount
    setReverbDebugValue(reverb.decay);
    setWetDebugValue(reverb.wet.value);
    setPlaybackRate(1)

    return () => {
      // player.dispose();
      // reverb.dispose();
    };
  }, [player, reverb]);

  const handlePlay = async () => {
    player.start();
  };

  const handleReverbChange = (event) => {
    const value = parseFloat(event.target.value);
    setReverbDebugValue(value);
    reverb.decay = value;
  };

  const handleWetChange = (event) => {
    const wetValue = parseFloat(event.target.value);
    setWetDebugValue(wetValue);
    reverb.wet.value = wetValue;
  };

  const handlePlaybackRateChange = (event) => {
    player.playbackRate = parseFloat(event.target.value)
    setPlaybackRate(player.playbackRate)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    player.load(objectUrl);
  };

  return (
    <div style={{ marginLeft: "50%" }}>
      <input type="file" accept=".mp3,.wav" onChange={handleFileChange} />
      <br />
      <button onClick={handlePlay}>Play</button>
      <div>
        <label>Reverb Decay:</label>
        <input
          type="range"
          min="0.1"
          max="100"
          step="0.1"
          onChange={handleReverbChange}
        />
        : {reverbDebugValue}
      </div>
      <div>
        <label>Reverb Wet:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={handleWetChange}
        />
        : {wetDebugValue}
      </div>
      <div>
        <label>Playback Rate:</label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          onChange={handlePlaybackRateChange}
        />
        : {playbackRate}
      </div>
    </div>
  );
};

export default ReverbComponent;
