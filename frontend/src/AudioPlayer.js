import React, { useState, useEffect } from "react";
import * as Tone from "tone";

let players = [1, 2, 3, 4];
let reverb = new Tone.Reverb();
for (let i = 0; i < 4; i++) {
  const player = new Tone.Player({ loop: true }).toDestination();
  player.connect(reverb);
  players[i] = player;
}

// Connect the reverb to the destination

export function clampNumber(input, min, max) {
  return input < min ? min : input > max ? max : input;
}

export function mapNumber(current, in_min, in_max, out_min, out_max) {
  const mapped =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clampNumber(mapped, out_min, out_max);
}

reverb.toDestination();

const AudioPlayer = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    return () => {
      players.forEach((player, idx) => player.stop());
      setAudioPlaying(false);
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
    const { volume, reverb, wet, playbackRate } = props.params;
    
    console.log(volume);
    // console.log("AudioPlayer: volumes", mapNumber(playbackRate, 0, 1, 0.9, 1.2), 100 - mapNumber(playbackRate, 0, 1, 0.1, 50), props.params);
    players.forEach(
      (player, idx) =>
        (player.volume.value = mapNumber(volume[idx], 0, 1, -60, 6))
    );

    if (audioPlaying) {
      // handleReverbChange(mapNumber(playbackRate, 0, 1, 10, 0));
      handlePlaybackRateChange(mapNumber(playbackRate, 0, 1, 0.9, 1));
    }

    // handleWetChange(reverseNormalizeValue(wet, 0, 100, 0, 1) / 100);
    // handlePlaybackRateChange(reverseNormalizeValue(playbackRate, 0, 1, 0.2, 1.5));
    // handleChorusChange(chorus);
    // handleChebyChange(cheby);
    // handleReverbToneChange(reverbTone);
  }, [props.params, audioPlaying]);

  const handlePlay = async () => {
    // Start the audio context
    await Tone.start();
    // Wait for all players to be loaded
    await Tone.loaded();
    props.onStart();
    players.forEach((player) => player.start());
    console.log("AudioPlayer: started", players);
    setTimeout(() => {
      setAudioPlaying(true);
    }, 2000);
    // setTimeout(() => {
    //   handleReverbChange(60);
    //   handlePlaybackRateChange(2)
    // }, 10000);
  };

  const handleReverbChange = (value) => {
    const reverbValue = parseFloat(value);

    // When changing properties of the reverb, disconnect and reconnect players
    players.forEach((player) => player.disconnect(reverb));
    // Apply new settings to reverb
    reverb.set({ decay: reverbValue });
    players.forEach((player) => player.connect(reverb));
  };

  const handleWetChange = (value) => {
    const wetValue = parseFloat(value);
    reverb.wet.value = wetValue;
  };

  const handlePlaybackRateChange = (value) => {
    players.forEach((player) => (player.playbackRate = parseFloat(value)));
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
