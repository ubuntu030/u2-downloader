const http = require('http');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');

//create a server object:
http.createServer(function (req, res) {
	const { method } = req
	let resObj = { status: 'fail' };
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (method === 'POST') {
		ytdl.getInfo('https://youtu.be/NO8iSOv3BBU')
			.then(info => {
				if (typeof info === 'object' && info.videoDetails && info.videoDetails.title) {
					resObj = { status: 'success' };
					// 取回資料後進行下載
					let stream = ytdl.downloadFromInfo(info);
					let writable = fs.createWriteStream(path.join(__dirname, '../public', info.videoDetails.title + '.mp4'));
					stream.pipe(writable);
					stream.on('finish', function () {
						res.write(JSON.stringify(resObj)); //write a response to the client
						res.end(); //end the response
					});
					stream.on('error', function (err) {
						resObj = { status: 'fail', errmsg: err };
						console.log(err);
						res.end(JSON.stringify(resObj)); //end the response
					});
				} else {
					res.write(JSON.stringify(JSON.stringify(info))); //write a response to the client
					res.end(); //end the response
				}
			}).catch(error => console.error(error));
	}
	// res.write(JSON.stringify(resObj)); //write a response to the client
	// res.end(); //end the response
	console.log('server running');
}).listen(8080); //the server object listens on port 8080