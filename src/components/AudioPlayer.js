// https://dev.to/jamland/audio-player-with-wavesurfer-js-react-1g3b

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";

function AudioPlayer({ url }) {
	const waveformRef = useRef(null);
	const [playing, setPlaying] = useState(false);
	const [regionSec, setRegionSec] = useState({ start: 0, end: 0 });
	let waveSurfer = null
	const toggle = () => setPlaying(!playing);
	const handlePlay = () => {
		waveformRef.current.play();
	}
	useEffect(() => {
		waveSurfer = waveformRef.current = WaveSurfer.create(
			{
				container: waveformRef.current,
				plugins: [
					RegionsPlugin.create({
						regionsMinLength: 2,
						dragSelection: {
							slop: 5
						}
					})
				]
			}
		)
		waveSurfer.load(url);

		waveSurfer.on('ready', () => {
			// https://wavesurfer-js.org/docs/methods.html
			waveSurfer.setVolume(0.5);
			// play only accepted by client's interaction due to policy of chrome
			// wavesurfer.play();
			waveSurfer.enableDragSelection({
				color: 'hsla(200, 100%, 30%, 0.3)'
			});
		})
		waveSurfer.on("region-created", function (region) {
			waveSurfer.clearRegions();
			console.log("region-created", region.id);
		});
		waveSurfer.on("region-update-end", function (region) {
			setRegionSec({ start: region.start, end: region.end });
		});
		waveSurfer.on('finish', () => {
			console.log('finished:' + url);
		});
		waveSurfer.on('seek', (e) => {
			// waveformRef.current.play();
		});

		return () => waveSurfer.destroy();
	}, [url]);

	return (
		<div>
			<div ref={waveformRef} />
			<button onClick={handlePlay}>Play/Pause</button>
		</div>
	);
}

export default AudioPlayer;