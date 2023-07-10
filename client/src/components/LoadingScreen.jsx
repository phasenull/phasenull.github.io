
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
function LoadingScreen(props) {
	return <Backdrop
		sx= {props.sx}
		open={props.open}>
		<CircularProgress color="inherit" />
		{props.children}
	</Backdrop>
}
export default LoadingScreen