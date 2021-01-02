const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const downloadRoute = require('./downloadRoute')
const convertRouter = require('./convertRoute');

const PORT = 8080;
const PATH_VIDEO = path.join(__dirname, '../video');
const PATH_AUDIO = path.join(__dirname, '../audio');
// 處理跨域請求
app.use(cors());
app.use(express.static(PATH_VIDEO));
app.use(express.static(PATH_AUDIO));
app.use(express.json());

app.use('/download', downloadRoute);
app.use('/convert', convertRouter);

app.get('/', (req, res) => {
	res.json({ status: 'fail' })
});

app.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`)
});