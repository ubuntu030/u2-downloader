const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const express = require('express');
const router = express.Router();
const VideoInfoCtrl = require('./VideoInfoCtrl');

const PATH_VIDEO = path.join(__dirname, '../video');

// TODO: 重新編輯寫入格式，並另外存成JSON..eg {id, name, path, audioPath}
router.use(function (req, res, next) {
	if (req.body && req.body.url) {
		next();
	} else {
		res.send({
			status: 'fail',
			errmsg: 'empty URL',
		});
	}
});

router.post('/', function (req, res) {
	try {
		// TODO: url vertify 
		// 下載影片
		ytdl.getInfo(req.body.url)
			.then(info => {
				if (typeof info === 'object' && info.videoDetails && info.videoDetails.title) {
					const VIDEO_NAME = info.videoDetails.title;
					const SAVE_FILE_PATH = path.join(PATH_VIDEO, VIDEO_NAME + '.mp4');
					let resObj = {
						status: 'fail',
						errmsg: '',
						file: { name: '', path: '', id: '' }
					};
					/**
					 * 無法下載擁有最高品質視訊&音訊 https://github.com/fent/node-ytdl-core/issues/374
					 * 若要最高品質視音訊，需個下載並合併
					 * 或參考 https://github.com/fent/node-ytdl-core/issues/770
					 * http://codebeta.blogspot.com/2017/12/pythonyoutube-dl-quality-ffmpeg.html
					 */
					// 取回資料後進行下載
					let stream = ytdl.downloadFromInfo(
						info,
						{ filter: 'audioandvideo', quality: 'highestvideo' }
					);
					// 在 react-scripts start 啟動下若將檔案寫入public下會觸發refresh
					// let writable = fs.createWriteStream(path.join(__dirname, '../public', info.videoDetails.title + '.mp4'));
					let writable = fs.createWriteStream(SAVE_FILE_PATH);
					stream.pipe(writable);
					stream.on('finish', function () {
						// Use fs.readFile() method to read the file 
						fs.readFile(SAVE_FILE_PATH, 'utf8', function (err, data) {
							if (err) {
								resObj.errmsg = err;
								res.json(resObj); //write a response to the client
							}
							// 確認可讀到file則回傳檔案路徑與檔案名
							const fileInfo = {
								name: VIDEO_NAME,
								path: SAVE_FILE_PATH,
								id: info.videoDetails.videoId,
								audioPath: '',
								url: info.videoDetails.video_url,
								embed: info.videoDetails.embed.iframeUrl
							}
							resObj.file = fileInfo;
							// 寫入 video_info.json
							new VideoInfoCtrl()
								.updateFileInfo(fileInfo)
								.then(data => {
									if (data && data.errmsg) {
										resObj.errmsg = data.errmsg
									} else {
										resObj.status = 'success';
									}
									res.json(resObj);
								});
						});
					});
					// 錯誤處理
					stream.on('error', function (err) {
						resObj = { status: 'fail', errmsg: err.message };
						console.error(err);
						res.json(resObj);
					});
				} else {
					res.json(resObj);
				}
			}).catch(error => {
				res.json({
					status: 'fail',
					errmsg: error.message,
				})
			});
	} catch (err) {
		console.error(err);
		res.send({
			status: 'fail',
			errmsg: err.message,
		});
	}
})


module.exports = router;