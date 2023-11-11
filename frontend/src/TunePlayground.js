import React, { useState, useEffect } from "react";
import * as Tone from "tone";

const ReverbComponent = () => {
  Tone.start();

  const [reverb, setReverb] = useState(new Tone.Reverb());
  const [player, setPlayer] = useState(new Tone.Player({loop: true}).toDestination());

  const [reverbDebugValue, setReverbDebugValue] = useState();
  const [wetDebugValue, setWetDebugValue] = useState();
  const [playbackRate, setPlaybackRate] = useState();

  const [chorus, setChorus] = useState(
    new Tone.Chorus({
      wet: 1,
    })
      .toDestination()
      .start()
  );
  const [chorusChannel, setChorusChannel] = useState(
    new Tone.Channel({ volume: -60 }).connect(chorus)
  );

  const [cheby, setCheby] = useState(new Tone.Chebyshev(50).toDestination());
  const [chebyChannel, setChebyChannel] = useState(
    new Tone.Channel({ volume: -60 }).connect(cheby)
  );

  const [reverbTone, setReverbTone] = useState(
    new Tone.Reverb(3).toDestination()
  );
  const [reverbToneChannel, setReverbToneChannel] = useState(
    new Tone.Channel({ volume: -60 }).connect(reverbTone)
  );

  const [chorusDebugSend, setChorusDebugSend] = useState();
  const [chebyshevDebugSend, setChebyshevDebugSend] = useState();
  const [reverbToneDebugSend, setReverbToneDebugSend] = useState();


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
    setPlaybackRate(1);

    setChorusDebugSend(-60)
    setChebyshevDebugSend(-60)
    setReverbToneDebugSend(-60)

    // make some effects
    // const chorus = new Tone.Chorus({
    //   wet: 1,
    // })
    //   .toDestination()
    //   .start();
    chorusChannel.receive("chorus");
    chebyChannel.receive("cheby");
    reverbToneChannel.receive("reverbTone");

    // send the player to all of the channels
    const playerChannel = new Tone.Channel().toDestination();
    playerChannel.send("chorus");
    playerChannel.send("cheby");
    playerChannel.send("reverbTone");

    player.connect(playerChannel);

    return () => {
      // player.dispose();
      // reverb.dispose();
    };
  }, [player]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    player.load(objectUrl);
  };

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
    player.playbackRate = parseFloat(event.target.value);
    setPlaybackRate(player.playbackRate);
  };

  const handleChorusChange = (e) => {
    chorusChannel.volume.value = parseFloat(e.target.value);
    setChorusDebugSend(chorusChannel.volume.value);
  };

  const handleChebyChange = (e) => {
    chebyChannel.volume.value = parseFloat(e.target.value);
    setChebyshevDebugSend(chebyChannel.volume.value);
  };

  const handleReverbToneChange = (e) => {
    reverbToneChannel.volume.value = parseFloat(e.target.value);
    setReverbToneDebugSend(reverbToneChannel.volume.value);
  }

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
      <div>
        <label>Chorus:</label>
        <input
          type="range"
          min="-60"
          max="6"
          step="0.01"
          defaultValue="-60"
          onChange={handleChorusChange}
        />
        : {chorusDebugSend}
      </div>
      <div>
        <label>Cheby:</label>
        <input
          type="range"
          min="-60"
          max="6"
          step="0.01"
          defaultValue="-60"
          onChange={handleChebyChange}
        />
        : {chebyshevDebugSend}
      </div>
      <div>
        <label>Reverb Tone:</label>
        <input
          type="range"
          min="-60"
          max="6"
          step="0.01"
          defaultValue="-60"
          onChange={handleReverbToneChange}
        />
        : {reverbToneDebugSend}
      </div>
    </div>
  );
};

export default ReverbComponent;
