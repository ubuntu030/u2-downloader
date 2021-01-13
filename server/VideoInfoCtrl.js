// https://stackoverflow.com/questions/34628305/using-promises-with-fs-readfile-in-a-loop
const util = require('util');
const fs = require('fs');
const path = require('path');

const FILE_INFO_PATH = path.join(__dirname, '../video/video_info.json');
const AUDIO_PATH = path.join(__dirname, '../audio');
const VIDEO_PATH = path.join(__dirname, '../video');


class VideoInfoCtrl {
	constructor(props = { id: '' }) {
		this.props = props;
	}
	// TODO: 當資料不為則創建
	getFilesInfo() {
		// 使用util 封裝fs.readFile 
		const readFile = util.promisify(fs.readFile);
		return readFile(FILE_INFO_PATH, 'utf-8').then(data => {
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
	 * @param {String} info.audioPath audio 路徑
	 * @param {String} info.embed 網頁嵌入路徑
	 * @param {String} info.ext 副檔名
	 * @return {Object} 寫入成功後回傳帶有文件資料的物件
	 */
	updateFileInfo(info = {}) {
		let respData = {
			errmsg: '',
			data: null
		};
		let newData = null;
		// TODO: 當 .json格式錯誤要回傳錯誤資訊
		return this.getFilesInfo()
			.then(response => {
				if (response.errmsg) {
					throw new Error(response.errmsg);
				}

				let oldData = response.data;
				// 檢查重複
				let checkArr = [];
				if (oldData && Array.isArray(oldData) && oldData.length > 0) {
					checkArr = oldData.filter(item => item.id === info.id);
				}
				// 重複則更新該筆資料 *清掉該筆資料，後面會用新資料concat
				if (Array.isArray(checkArr) && checkArr[0] && checkArr[0].id) {
					oldData = oldData.filter(item => (item.id !== checkArr[0].id));
					respData.data = oldData;
				}
				// 確認資訊存在
				if (!(info.id && info.name)) {
					respData.errmsg = '欲寫入資訊為空';
					return respData;
				}
				// 加入資料並寫進JSON file
				newData = oldData.concat([info]);
				const writeFile = util.promisify(fs.writeFile);
				return writeFile(FILE_INFO_PATH, JSON.stringify(newData), 'utf8')
			}).then(err => {
				// 處理 writeFile的錯誤訊息
				if (err) {
					respData.errmsg = err.message;
					throw Error(err.message)
				}
				respData.data = newData;
				return respData
			}).catch(err => {
				respData.errmsg = err.message;
				return respData;
			});
	}
	/**
	 * 取得該路徑下的檔案
	 * @param {String} type [video||audio]
	 * @return {Array<String>}
	 */
	getFilesUdrLocation(type) {
		const folderPath = (type === 'video' ? VIDEO_PATH : AUDIO_PATH);
		// 使用util 封裝fs.readFile 
		const readdir = util.promisify(fs.readdir);
		return readdir(folderPath).then(arr => {
			console.log(arr);
			// 轉換JSON
			return {
				errmsg: '',
				data: { list: arr, path: folderPath }
			};
		}).catch(err => {
			console.log(err);
			return { errmsg: err.message, data: null };
		})
	}

	// TODO:檢查另外拉出來做
	// 檢查 JSON資料跟檔案是否存在路徑
	checkInfo() {

	}
}

module.exports = VideoInfoCtrl