import { useState } from "react";

function Form(props) {
	const [url, setUrl] = useState('');
	const { list, setList } = props;
	// 'https://youtu.be/NO8iSOv3BBU'
	const handleSubmit = (e) => {
		// TODO: add validate
		e.preventDefault();
		fetchVideo(url).then(data => {
			const info = data.file;
			// 避免塞入重複 id的項目
			if (info && info.id) {
				let fltrList = list.filter(item => item.id === info.id)
				if (fltrList.length === 0) {
					setList(arr => [...arr, info]);
				}
			}
			// TODO: error handle
		});
		setUrl('');
	}

	const handleChange = (e) => {
		let { value } = e.target;
		setUrl(value);
	}

	return (
		<form action="#" onSubmit={handleSubmit} >
			<input type="text" name="" id="" value={url} onChange={handleChange} />
			<input type="submit" value="Download"></input>
		</form>
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

export default Form;