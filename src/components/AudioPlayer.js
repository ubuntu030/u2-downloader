// https://dev.to/jamland/audio-player-with-wavesurfer-js-react-1g3b

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";

function AudioPlayer({ url, id }) {
	const waveformRef = useRef(null);
	const [playing, setPlaying] = useState(false);
	const [regionSec, setRegionSec] = useState(null); //{ start: 0, end: 0 }
	let waveSurfer = null;
	let Region = null;
	const toggle = () => setPlaying(!playing);
	const handlePlay = (mode) => {
		if (mode === 'region') {
			const { start, end } = regionSec;
			waveformRef.current.play(start, end);
			return;
		}
		waveformRef.current.playPause();
	}
	const cleanRegion = () => {
		waveformRef.current.clearRegions();
		setRegionSec(null);
	}
	useEffect(() => {
		Region = RegionsPlugin.create({
			regionsMinLength: 2,
			dragSelection: {
				slop: 5
			}
		});
		waveSurfer = waveformRef.current = WaveSurfer.create(
			{
				container: waveformRef.current,
				plugins: [
					Region
				]
			}
		)
		waveSurfer.load(url);

		waveSurfer.on('ready', () => {
			// https://wavesurfer-js.org/docs/methods.html
			waveSurfer.setVolume(0.5);
			// play only accepted by client's interaction due to policy of chrome
			// wavesurfer.play();
			// 啟用拖拉產生region
			waveSurfer.enableDragSelection({
				color: 'hsla(200, 100%, 30%, 0.3)'
			});
		})
		waveSurfer.on("region-created", function (region) {
			// 在創造新Region前刪除當前Region
			waveSurfer.clearRegions();
			console.log("region-created", region.id);
		});
		waveSurfer.on("region-update-end", function (region) {
			// region.wavesurfer.container
			// 更新新的Region秒數 
			setRegionSec({ start: region.start, end: region.end });
		});
		waveSurfer.on('finish', () => {
			console.log('finished:' + url);
		});
		waveSurfer.on('seek', (e) => {
			// waveformRef.current.play();
		});

		return () => waveSurfer.destroy();
	}, [url, id]);

	return (
		<div>
			<div id={id} ref={waveformRef} />
			<button onClick={() => { handlePlay('all') }}>Play/Pause</button>
			{
				regionSec ?
					<>
						<button onClick={() => { handlePlay('region') }}>Play Region</button>
						<button onClick={cleanRegion}>Clean Region</button>
					</> : null
			}
		</div >
	);
}

export default AudioPlayer;