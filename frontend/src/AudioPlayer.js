import React, { useState, useEffect } from "react";
import * as Tone from "tone";

let players = [1, 2, 3, 4];
let reverb = new Tone.Reverb();
for (let i = 0; i < 4; i++) {
  const player = new Tone.Player().toDestination();
  player.connect(reverb);
  players[i] = player;
}
// Connect the reverb to the destination

function reverseNormalizeValue(normalizedValue) {
  // Minimum and maximum values of the input scale
  const minInput = -60;
  const maxInput = 6;

  // Minimum and maximum values of the output scale
  const minOutput = 0;
  const maxOutput = 100;

  // Reverse normalization from the output scale to the input scale
  return (
    ((normalizedValue - minOutput) / (maxOutput - minOutput)) *
      (maxInput - minInput) +
    minInput
  );
}
reverb.toDestination();

const AudioPlayer = (props) => {
  // const [reverb, setReverb] = useState(new Tone.Reverb());
  // const [players, setPlayers] = useState([1, 2, 3, 4]); //!!! Don't forget to inititalize with props.tracks array

  const [reverbDebugValue, setReverbDebugValue] = useState();
  const [wetDebugValue, setWetDebugValue] = useState();
  const [playbackRate, setPlaybackRate] = useState();

  // const [chorus, setChorus] = useState(
  //   new Tone.Chorus({
  //     wet: 1,
  //   })
  //     .toDestination()
  //     .start()
  // );

  // const [chorusChannel, setChorusChannel] = useState(
  //   new Tone.Channel({ volume: -60 }).connect(chorus)
  // );

  // const [cheby, setCheby] = useState(new Tone.Chebyshev(50).toDestination());
  // const [chebyChannel, setChebyChannel] = useState(
  //   new Tone.Channel({ volume: -60 }).connect(cheby)
  // );

  // const [reverbTone, setReverbTone] = useState(
  //   new Tone.Reverb(3).toDestination()
  // );
  // const [reverbToneChannel, setReverbToneChannel] = useState(
  //   new Tone.Channel({ volume: -60 }).connect(reverbTone)
  // );

  const [chorusDebugSend, setChorusDebugSend] = useState();
  const [chebyshevDebugSend, setChebyshevDebugSend] = useState();
  const [reverbToneDebugSend, setReverbToneDebugSend] = useState();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load the player with a URL to your audio file
    // Connect the player to the reverb
    // players.forEach((player) => {
    //   player = new Tone.Player({ loop: true }).toDestination();
    //   player.connect(reverb);
    // });

    // console.log(player);
    setReverbDebugValue(reverb.decay);
    setWetDebugValue(reverb.wet.value);
    setPlaybackRate(1);
    setChorusDebugSend(-60);
    setChebyshevDebugSend(-60);
    setReverbToneDebugSend(-60);

    // chorusChannel.receive("chorus");
    // chebyChannel.receive("cheby");
    // reverbToneChannel.receive("reverbTone");

    // send the player to all of the channels
    // const playerChannel = new Tone.Channel().toDestination();
    // playerChannel.send("chorus");
    // playerChannel.send("cheby");
    // playerChannel.send("reverbTone");

    // players.forEach((player) => player.connect(playerChannel));
    return () => {
      // players.forEach((player) => player.dispose());
      // Tone.Transport.dispose()
      // reverb.dispose();
      // console.log('AudioPlayer: Unmounting')
      players.forEach((player, idx) => player.stop());
    };
  }, []);

  useEffect(() => {
    if (!props?.tracks?.length || loaded) {
      return;
    }
    players.forEach((player, idx) => player.load(props.tracks[idx]));
    setLoaded(true);
    console.log(props?.tracks, "AudioPlayer: Initialized");
    handlePlay();
  }, [props?.tracks?.length]);

  useEffect(() => {
    if (!Object.keys(props?.params || {})?.length) {
      return;
    }
    const { volume /*, reverb, wet, playbackRate*/ } = props.params;

    console.log("AudioPlayer: volumes", volume);

    players.forEach(
      (player, idx) =>
        (player.volume.value = reverseNormalizeValue(volume[idx] * 100))
    );
    // handleReverbChange(reverb);
    // handleWetChange(wet);
    // handlePlaybackRateChange(playbackRate);
    // handleChorusChange(chorus);
    // handleChebyChange(cheby);
    // handleReverbToneChange(reverbTone);
  }, [props.params]);

  const handlePlay = async () => {
    // Start the audio context
    await Tone.start();
    // Wait for all players to be loaded
    await Tone.loaded();
    players.forEach((player) => player.start());
    console.log("AudioPlayer: started", players);
  };

  const handleReverbChange = (event) => {
    const value = parseFloat(event.target.value);
    setReverbDebugValue(value);
    reverb.decay = value;
  };

  const handleWetChange = (value) => {
    const wetValue = parseFloat(value);
    setWetDebugValue(wetValue);
    reverb.wet.value = wetValue;
  };

  const handlePlaybackRateChange = (value) => {
    players.forEach((player) => (player.playbackRate = parseFloat(value)));
    setPlaybackRate(value);
  };

  // const handleChorusChange = (value) => {
  //   chorusChannel.volume.value = parseFloat(value);
  //   setChorusDebugSend(chorusChannel.volume.value);
  // };

  // const handleChebyChange = (value) => {
  //   chebyChannel.volume.value = parseFloat(value);
  //   setChebyshevDebugSend(chebyChannel.volume.value);
  // };

  // const handleReverbToneChange = (value) => {
  //   reverbToneChannel.volume.value = parseFloat(value);
  //   setReverbToneDebugSend(reverbToneChannel.volume.value);
  // };

  return (
    <>
      {/* <button onClick={handlePlay}>Play</button> */}
      {/* <br />
      <div>reverbDebugValue: {reverbDebugValue}</div><br />
      <div>wetDebugValue: {wetDebugValue}</div><br />
      <div>playbackRate:{playbackRate}</div><br />
      <div>chorusDebugSend:{chorusDebugSend}</div><br />
      <div>chebyshevDebugSend:{chebyshevDebugSend}</div><br />
      <div>reverbToneDebugSend:{reverbToneDebugSend}</div><br /> */}
    </>
  );
};

export default AudioPlayer;
