import { useState } from "react";

function Form(props) {
	const [url, setUrl] = useState('')
	const { setList } = props;

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchVideo('https://youtu.be/NO8iSOv3BBU').then(data => {
			setList(arr => [...arr, data]);
		})

	}

	const handleChange = (e) => {
		let { value } = e.target;
		setUrl(value);
	}

	return (
		<form action="#" onSubmit={handleSubmit} >
			<input type="text" name="" id="" onChange={handleChange} />
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
		let resp = await fetch('http://localhost:8080/', {
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