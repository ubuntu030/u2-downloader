const path = require('path');
const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
const { error } = require('console');
// audio資料夾路徑
const PATH_AUDIO = path.join(__dirname, '../audio');
// 設定 ffmpeg路徑
ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg');

router.post('/', (req, res, _) => {
	// 回傳格式
	let resObj = {
		status: 'fail',
		errmsg: '',
		file: {}
	};
	let fileObj = Object.assign({}, req.body, { mp3path: '' });
	// 檔案名稱
	const videoName = fileObj.name;
	// 檔案路徑
	const videoPath = fileObj.path;
	const mp3path = path.join(PATH_AUDIO, videoName + '.mp3');
	ffmpeg(videoPath)
		.output(mp3path)
		.audioBitrate('320k')
		.on('end', function (d) {
			console.log(d);
			console.log('Finished processing');
			resObj.status = 'success'
			fileObj.path = videoPath;
			fileObj.mp3path = mp3path
			fileObj.name = videoName + '.mp3';
			resObj.file = fileObj;
			res.json(resObj)
		})
		.on('error', err => {
			// 錯誤處理
			resObj.errmsg = err.message;
			console.error(err.message);
			res.sendStatus(500).send(resObj);
		})
		.run();
});

module.exports = router;