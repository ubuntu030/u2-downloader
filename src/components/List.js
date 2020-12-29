import { ListGroup, Button } from "react-bootstrap";

function List(props) {
	const { list, handleConvert } = props;

	const handleClick = id => {
		const targetArr = list.filter(item => item.id === id);
		if (targetArr.length > 0 && typeof targetArr[0] === 'object') {
			const { path } = targetArr[0]
			console.log(path);
			handleConvert(targetArr[0]);
		}
	}

	return (
		<ListGroup>
			{
				Array.isArray(list) && list.length > 0 ?
					list.map(item => {
						let mp3path = item.mp3path;
						return (<ListGroup.Item key={item.id} id={item.id} className="d-flex justify-content-between">
							<div>{item.name}</div>
							<ConverBotton disabled={mp3path ? true : false} clickEvent={handleClick.bind(this, item.id)} />
						</ListGroup.Item>
						)
					}) : null
			}
		</ListGroup>
	)
}

function ConverBotton({ disabled = false, clickEvent }) {
	let btnTemplate = null;
	if (disabled) {
		btnTemplate = (
			<Button variant="secondary" disabled>
				Converted
			</Button>
		)
	} else {
		btnTemplate = (
			<Button variant="primary" onClick={clickEvent} >
				Convert
			</Button>
		)
	}
	return btnTemplate;
}

export default List;

