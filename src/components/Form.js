import { useState } from "react";

function Form(props) {
	const [url, setUrl] = useState('')
	const { setList } = props;

	const handleSubmit = (e) => {
		e.preventDefault();
		let nUrl = url ? url : 'http://localhost:8080/';
		fetchVideo(nUrl).then(data => {
			setList(arr => [...arr, data]);
		})

	}

	const handleChange = (e) => {
		let { value } = e.target;
		setUrl(value);
	}

	return (
		<form action="" onSubmit={handleSubmit} >
			<input type="text" name="" id="" onChange={handleChange} />
			<input type="submit" value="Download"></input>
		</form>
	)
}

async function fetchVideo(url) {
	let formData = new FormData();
	formData.append('url', url);
	try {
		let resp = await fetch(url, { method: 'POST' });
		let data = await resp.json();
		return JSON.parse(data);
	} catch (err) {
		console.error(err); // TypeError: failed to fetch
		throw new Error("Whoops!");
	}
}

export default Form;