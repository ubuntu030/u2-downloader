import React, { useState, useEffect } from "react";
// custumize hook
const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    if (playing) {
      audio.play().then(_ => {
        // Automatic playback started!
        // Show playing UI.
        console.log("audio played auto");
      })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
          console.log("playback prevented");
        });
    } else {
      audio.pause();
    }
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const SoundTest = ({ url }) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div>
      <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
};

export default SoundTest;
