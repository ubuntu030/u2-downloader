const path = require('path');
const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
// audio資料夾路徑
const PATH_AUDIO = path.join(__dirname, '../audio');
// 設定 ffmpeg路徑
ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg');
// TODO: 音軌可視畫，長度編輯
router.post('/', (req, res, _) => {
	// 回傳格式
	let resObj = {
		status: 'fail',
		errmsg: '',
		file: {},
		ext: ''
	};
	let fileObj = Object.assign({}, req.body, { mp3path: '' });
	// 檔案名稱
	const videoName = fileObj.name;
	// 檔案路徑
	const videoPath = fileObj.path;
	const mp3path = path.join(PATH_AUDIO, videoName + '.wav');
	// 影片轉換處理
	ffmpeg(videoPath)
		.output(mp3path)
		.audioBitrate('320k')
		.on('end', function () {
			console.log('Finished processing');
			resObj.status = 'success'
			fileObj.path = videoPath;
			fileObj.mp3path = mp3path
			fileObj.name = videoName;
			fileObj.ext = '.wav';
			resObj.file = fileObj;
			res.json(resObj)
		})
		.on('error', err => {
			// 錯誤處理
			console.error(err.message);
			resObj.errmsg = err.message;
			res.json(resObj)
		})
		.run();
});

module.exports = router;