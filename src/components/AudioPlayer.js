// https://dev.to/jamland/audio-player-with-wavesurfer-js-react-1g3b

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";


function AudioPlayer({ url }) {
	const waveformRef = useRef(null);
	const [playing, setPlaying] = useState(false);
	// let waveSurfer = null
	const toggle = () => setPlaying(!playing);
	const handlePlay = () => {
		setPlaying(!playing);
		waveformRef.current.playPause();
	}
	useEffect(() => {
		waveformRef.current = WaveSurfer.create({ container: waveformRef.current })
		waveformRef.current.load(url);

		waveformRef.current.on('ready', () => {
			// https://wavesurfer-js.org/docs/methods.html
			waveformRef.current.setVolume(0.5);
			// play only accepted by client's interaction due to policy of chrome
			// waveformRef.current.play();
		})
		waveformRef.current.on('finish', () => {
			setPlaying(!playing);
		});

		// TODO: handling when Drag indicator 

		return () => waveformRef.current.destroy();
	}, [url]);

	return (
		<div>
			<div ref={waveformRef} />
			<button onClick={handlePlay}>Play/Pause</button>
		</div>
	);
}

export default AudioPlayer;