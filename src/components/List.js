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
			{list.map(item => {
				return (<ListGroup.Item key={item.id} id={item.id} className="d-flex justify-content-between">
					<div>{item.name}</div>
					<Button variant="primary" onClick={handleClick.bind(this, item.id)}>Primary</Button></ListGroup.Item>
				)
			})}
		</ListGroup>
	)
}

export default List;

