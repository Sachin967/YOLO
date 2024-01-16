import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import logo from "../../public/yolo2.png";
const VideoRoom = () => {
	const { userId } = useParams();
	const [element, setElement] = useState(null);
	const containerRef = useRef(null);
	const Navigate = useNavigate();

	const { userdetails } = useSelector((state) => state.auth);

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
				userdetails.name
			);
			const zc = ZegoUIKitPrebuilt.create(kitToken);
			zc.joinRoom({
				container: element,
				onLeaveRoom: () => {
					Navigate(`/messages`);
				},
				showPreJoinView: false,
				branding: {
					logoURL: logo
				},
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
		<div className="w-screen flex items-center justify-center h-screen bg-white dark:bg-black">
			<div className="text-cyan-700" ref={containerRef} />
		</div>
	);
};
export default VideoRoom;
