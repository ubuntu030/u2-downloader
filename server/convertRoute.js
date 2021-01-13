const path = require('path');
const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
const VideoInfoCtrl = require('./VideoInfoCtrl');

// audio資料夾路徑
const PATH_AUDIO = path.join(__dirname, '../audio');
// 設定 ffmpeg路徑
ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg');
router.post('/', (req, res, _) => {
	// 回傳格式
	let resObj = {
		status: 'fail',
		errmsg: '',
		file: {},
		ext: ''
	};
	let fileObj = Object.assign({}, req.body, { audioPath: '' });
	// 檔案名稱
	const videoName = fileObj.name;
	// 檔案路徑
	const videoPath = fileObj.path;
	const audioPath = path.join(PATH_AUDIO, videoName + '.wav');
	// 影片轉換處理
	ffmpeg(videoPath)
		.output(audioPath)
		.audioBitrate('320k')
		.on('end', function () {
			console.log('Finished processing');
			resObj.status = 'success'
			fileObj.path = videoPath;
			fileObj.audioPath = audioPath
			fileObj.name = videoName;
			fileObj.ext = '.wav';
			resObj.file = fileObj;
			// res.json(resObj)
			new VideoInfoCtrl()
				.updateFileInfo(fileObj)
				.then(data => {
					res.json(resObj);
				})
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