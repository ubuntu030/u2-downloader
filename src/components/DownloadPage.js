import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

function DownloadPage(props) {
	const [url, setUrl] = useState('');
	const { list, setList, setDwnloading } = props;
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateYouTubeUrl(url)) {
			alert('URL不匹配');
			return;
		}
		setDwnloading(true);
		fetchVideo(url).then(data => {
			const info = data.file;
			// TODO: 錯誤處理
			// 避免塞入重複 id的項目
			if (info && info.id) {
				let fltrList = list.filter(item => item.id === info.id)
				if (fltrList.length === 0) {
					setList(arr => [...arr, info]);
				}
			}
			setDwnloading(false);
			setUrl('');
			// TODO: error handle
		});
	}

	const handleChange = (e) => {
		let { value } = e.target;
		setUrl(value);
	}

	return (
		<div>
			<Form onSubmit={handleSubmit}>
				<InputGroup className="fixed-bottom">
					<Form.Control
						placeholder="URL of video"
						aria-label="URL of video"
						value={url}
						onChange={handleChange}
					/>
					<InputGroup.Append>
						<Button variant="outline-secondary" type="submit">Download</Button>
					</InputGroup.Append>
				</InputGroup>
			</Form>
		</div>
	)
}
/**
 * 下載影片
 * @param {String} url youtube URL
 * @return {Promise}
 */
async function fetchVideo(url) {
	try {
		let sendObj = { url: url };
		let resp = await fetch('http://localhost:8080/download', {
			method: 'POST',
			body: JSON.stringify(sendObj),
			headers: {
				'content-type': 'application/json'
			},
		});
		return await resp.json();
	} catch (err) {
		console.error(err); // TypeError: failed to fetch
		throw new Error("Whoops!");
	}
}
/**
 * 驗證 Youtube網址
 * @param {String} url 
 * @return {Boolean} true通過,false失敗 
 */
function validateYouTubeUrl(url) {
	let result = false;
	if (url !== undefined || url !== '') {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
		const match = url.match(regExp);
		if (match && match[2].length === 11) {
			// Do anything for being valid
			result = true
		}
	}
	return result;
}

export default DownloadPage;