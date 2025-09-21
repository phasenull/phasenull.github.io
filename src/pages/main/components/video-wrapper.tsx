export default function VideoWrapper(
	props: React.VideoHTMLAttributes<HTMLVideoElement> & { children: any }
) {
	return <video {...props} preload="metadata"> {props.children} </video>;
}
