import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef, useState } from "react";
const VideoRoom = () => {
	const { userId } = useParams();
	const [element, setElement] = useState(null);
	const containerRef = useRef(null);
	useEffect(() => {
		setElement(containerRef.current);
	}, []);
	useEffect(() => {
		const videoCall = async (element) => {
			const appId = 1592903408;
			const serverSecret = "90ea41275dba3e15a7274b1ef8f2a14f";
			const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
				appId,
				serverSecret,
				userId,
				Date.now().toString(),
				"Sachin"
			);
			const zc = ZegoUIKitPrebuilt.create(kitToken);
			zc.joinRoom({
				container: element,

				scenario: {
					mode: ZegoUIKitPrebuilt.OneONoneCall
				},
				showScreenSharingButton: false
			});
		};
		if (element) {
			videoCall(element);
		}
	}, [element, userId]);

	return (
		<div className="w-screen flex items-center justify-center h-screen bg-black">
			<div className="bg-black" ref={containerRef} />
		</div>
	);
};
export default VideoRoom;
