const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const cors = require('cors');
const bodyParser = require('body-parser')

const PORT = 8080;
// 處理跨域請求
app.use(cors());
// app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json());

app.post('/', function (req, res) {
	// TODO: url vertify
	ytdl.getInfo(req.body.url)
		.then(info => {
			if (typeof info === 'object' && info.videoDetails && info.videoDetails.title) {
				resObj = { status: 'success' };
				// 取回資料後進行下載
				let stream = ytdl.downloadFromInfo(info);
				// 在 react-scripts start 啟動下若將檔案寫入public下會觸發refresh
				// let writable = fs.createWriteStream(path.join(__dirname, '../public', info.videoDetails.title + '.mp4'));
				let writable = fs.createWriteStream(path.join(__dirname, '../video', info.videoDetails.title + '.mp4'));
				stream.pipe(writable);
				stream.on('finish', function () {
					res.json(resObj); //write a response to the client
				});
				stream.on('error', function (err) {
					resObj = { status: 'fail', errmsg: err };
					console.log(err);
					res.json(resObj); //end the response
				});
			} else {
				res.json(resObj); //write a response to the client
			}
		}).catch(error => {
			res.json(error)
		});
})

app.get('/', (req, res) => {
	res.json({ status: 'fail' })
})

app.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`)
})