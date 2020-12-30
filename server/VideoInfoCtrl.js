// https://stackoverflow.com/questions/34628305/using-promises-with-fs-readfile-in-a-loop
const util = require('util');
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../video/video_info.json');

class VideoInfoCtrl {
	constructor(props = { id: '123' }) {
		this.props = props;
	}

	getFile() {
		// 使用util 封裝fs.readFile 
		const readFile = util.promisify(fs.readFile);
		return readFile(FILE_PATH, 'utf-8').then(data => {
			console.log(JSON.parse(data));
			// 轉換JSON
			return { errmsg: '', data: JSON.parse(data) };
		}).catch(err => {
			console.log(err);
			return { errmsg: err.message, data: null };
		})
	}
	/**
	 * 寫入影片資訊
	 * @param {Object} info	
	 * @param {String} info.id
	 * @param {String} info.name
	 * @param {String} info.path	mp4路徑
	 * @param {String} info.mp3path mp3路徑
	 * @return {Object} 寫入成功後回傳帶有文件資料的物件
	 */
	updateFile(info = {}) {
		return this.getFile()
			.then(response => {
				let oldData = response.data;
				// 檢查重複
				let checkArr = [];
				if (oldData && Array.isArray(oldData) && oldData.length > 0) {
					checkArr = oldData.filter(item => item.id === info.id);
				}
				// 若有重複則不寫入並直接回傳 
				if (Array.isArray(checkArr) && checkArr[0] && checkArr[0].id) {
					return {
						errmsg: '',
						data: oldData
					}
				}
				// 確認資訊存在
				if (!(info.id && info.name)) {
					return {
						errmsg: 'info 錯誤',
						data: null
					}
				}
				// 加入資料並寫進JSON file
				const newData = oldData.concat([info]);
				const writeFile = util.promisify(fs.writeFile);
				return writeFile(FILE_PATH, JSON.stringify(newData), 'utf8')
			}).then(data => {
				console.log(data);
				return data
			});
	}
	// TODO:檢查另外拉出來做
	// 檢查 JSON資料跟檔案是否存在路徑
	checkInfo() {

	}
}

module.exports = VideoInfoCtrl