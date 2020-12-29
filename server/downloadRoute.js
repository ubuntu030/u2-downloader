const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const express = require('express');
const router = express.Router();
const app = express();
const PATH_VIDEO = path.join(__dirname, '../video');

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
	// TODO: url vertify 
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
				 */
				// 取回資料後進行下載
				let stream = ytdl.downloadFromInfo(
					info,
					{ quality: 'highest' }
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
						resObj.file = {
							name: VIDEO_NAME,
							path: SAVE_FILE_PATH,
							id: info.videoDetails.videoId,
							mp3path: ''
						}
						res.json(resObj);
					});
				});
				stream.on('error', function (err) {
					resObj = { status: 'fail', errmsg: err };
					console.log(err);
					res.json(resObj);
				});
			} else {
				res.json(resObj);
			}
		}).catch(error => {
			res.json(error)
		});
})


module.exports = router;