import { Spinner } from "react-bootstrap";
/**
 * 顯示讀取
 * @param {Object} props 
 * @param {Boolean} props.isLoading 是否讀取中
 * @return {Component} 
 */
function Loading(props) {
	const { isLoading } = props;
	return isLoading ? <Spinner animation="border" variant="primary" /> : null;
}

export default Loading;