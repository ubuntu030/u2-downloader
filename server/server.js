const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const cors = require('cors');
const express = require('express');
const app = express();
const convertRouter = require('./convertRoute');


const PORT = 8080;
const PATH_VIDEO = path.join(__dirname, '../video');
// 處理跨域請求
app.use(cors());
app.use(express.static(PATH_VIDEO))
app.use(express.json());

app.use('/convert', convertRouter)

app.post('/', function (req, res) {
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
				// 取回資料後進行下載
				let stream = ytdl.downloadFromInfo(info);
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
							id: info.videoDetails.videoId
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

app.get('/', (req, res) => {
	res.json({ status: 'fail' })
});

app.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`)
});