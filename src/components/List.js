import { useState } from "react";
import { ListGroup, Button } from "react-bootstrap";
import SoudTest from "./SoudTest";
import AudioPlayer from "./AudioPlayer";
import Loading from "./Loading";

// TODO: convert 需要整新 waversurfer
/**
 * 顯示影音下載列表
 * @param {Object} props 
 * @param {Array[Object]} list
 * @param {Function} handleConvert
 * @return {Element} 
 */
function List(props) {
	const { list, handleConvert } = props;
	const [converting, setConverting] = useState(false);
	const handleClick = id => {
		const targetArr = list.filter(item => item.id === id);
		if (targetArr.length > 0 && typeof targetArr[0] === 'object') {
			const { path } = targetArr[0]
			console.log(path);
			setConverting(true);
			handleConvert(targetArr[0])
				.then(() => {
					setConverting(false);
				});
		}
	}

	return (
		<ListGroup>
			{
				Array.isArray(list) && list.length > 0 ?
					list.map(item => {
						let audioPath = item.audioPath;
						let name = item.name;
						const fileURL = `http://localhost:8080/${name}${item.ext}`;
						return (
							<ListGroup.Item key={item.id} id={item.id} className="flex-column" >
								<div className="d-flex flex-row">
									<div className="d-flex flex-grow-1">{name}</div>
									<div>
										{
											converting ?
												<Loading isLoading={converting} /> :
												<ConverBotton disabled={audioPath ? true : false} clickEvent={handleClick.bind(this, item.id)} />
										}
									</div>
								</div>
								<div className="">
									{
										(item.audioPath) ? <AudioPlayer url={fileURL} id={item.id} /> : null
									}
									{/* <SoudTest url={fileURL} /> */}
								</div>
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

