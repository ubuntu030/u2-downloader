import { Spinner } from "react-bootstrap";
/**
 * 顯示讀取
 * @param {Object}	props 
 * @param {Boolean}	props.isLoading 是否讀取中
 * @param {String}	props.size 'sm'
 * @return {Component} 
 */
function Loading(props) {
	const { isLoading, size='' } = props;
	return isLoading ? <Spinner animation="border" variant="primary" size={size} /> : null;
}

export default Loading;