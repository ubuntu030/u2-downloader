const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const ytdl = require('ytdl-core');

app.post('/', function (req, res) {
	ytdl.getInfo('https://youtu.be/NO8iSOv3BBU')
		.then(info => {
			if (typeof info === 'object' && info.videoDetails && info.videoDetails.title) {
				resObj = { status: 'success' };
				// 取回資料後進行下載
				let stream = ytdl.downloadFromInfo(info);
				let writable = fs.createWriteStream(path.join(__dirname, '../public', info.videoDetails.title + '.mp4'));
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

app.listen(8080, () => {
	console.log('Example app listening at http://localhost:8080')
})