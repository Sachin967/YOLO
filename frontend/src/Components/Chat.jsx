import { useCallback, useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { messaging } from "../config/axios";
import useCustomToast from "../config/toast";
import ScrollableChat from "./ScrollableChat";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, useDisclosure } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import GroupInfoEditModal from "./Modals/GroupInfoEditModal";
import UsersSearchModal from "./Modals/UsersSearchModal";
import AlertLeaveGroup from "./Modals/AlertDialog";
import EmojiPicker from "emoji-picker-react";
import { CiVideoOn } from "react-icons/ci";
import { PiPaperPlaneLight } from "react-icons/pi";
const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;
const Chat = ({ fetchAgain, setFetchAgain, FetchChats }) => {
	const [messages, setMessage] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [user, setUser] = useState([]);
	const { userdetails } = useSelector((state) => state.auth);
	const {
		selectedUsers,
		chatdata,
		notification,
		setNotification,
		updatedName,
		setUpdatedName,
		updatedImage,
		setUpdatedImage
	} = ChatState();
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setisTyping] = useState(false);
	const [showGroupInfo, setShowGroupInfo] = useState(false);
	const [emojishow, setEmojishow] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isListUserOpen, onOpen: onListUserOpen, onClose: onListUserClose } = useDisclosure();
	const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
	const [isLink, setLink] = useState();
	const [userId, setUserId] = useState();
	
	// const handleImageUpdate = (newImage) => {
	// 	console.log(newImage);
	// 	setUpdatedImage(newImage);
	// };

	// const handleGroupNameUpdate = (newGroupName) => {
	// 	console.log(newGroupName);
	// 	setUpdatedName(newGroupName);
	// };
	const showToast = useCustomToast();
	let otherUser;
	for (const key in chatdata) {
		if (chatdata[key]._id !== chatdata._id) {
			otherUser = chatdata[key];
			break;
		}
	}
	const addEmoji = (selectedEmoji) => {
		setNewMessage((prevText) => prevText + selectedEmoji.emoji);
	};
	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", userdetails);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setisTyping(true));
		socket.on("stop typing", () => setisTyping(false));
	}, []);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedUsers;
	}, [selectedUsers]);
	useEffect(() => {
		socket.on("message received", (newMessageRecieved) => {
			if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chatId._id) {
				if (!notification.includes(newMessageRecieved)) {
					setNotification([newMessageRecieved, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessage([...messages, newMessageRecieved]);
			}
		});
	});

	const fetchMessages = async () => {
		try {
			if (!selectedUsers) return;
			messaging
				.get(`/message/${selectedUsers._id}`)
				.then((res) => {
					console.log(res.data.response)
					setUser(res.data.response);
					setMessage(res.data.message);
					socket.emit("join chat", selectedUsers._id);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {}
	};

	const typingHandler = (e) => {
		setNewMessage(e.target.value);
		if (!socketConnected) return;
		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedUsers._id);
		}
		let lastTypingTime = new Date().getTime();
		const timerLength = 3000;
		setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength && typing) {
				socket.emit("stop typing", selectedUsers._id);
				setTyping(false);
			}
		}, timerLength);
	};
	function formatJoinDate(dateString) {
		const formattedDate = new Date(dateString).toLocaleString("en-US", {
			month: "long",
			year: "numeric"
		});
		return `Joined on ${formattedDate}`;
	}


	const handleShowGroupInfo = () => {
		setShowGroupInfo((prevState) => !prevState);
	};
	const openEmoji = () => {
		setEmojishow((prevEmojiShow) => !prevEmojiShow);
	};
	const Navigate = useNavigate();

	const SendMessage = () => {
		if (newMessage) {
			socket.emit("stop typing", selectedUsers._id);
			setNewMessage("");
			// messaging
			// 	.post("/message", { content: newMessage, chatId: selectedUsers._id })
			// 	.then((res) => {
			// 		if (res.data) {
			// 			console.log(res.data.populatedMessage);
			// 			socket.emit("new message", res.data.populatedMessage);
			// 			setMessage([...messages, res.data.populatedMessage]);
			// 		}
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	});
			sendMessageToServer(newMessage, selectedUsers._id);
		}
	};
	const sendMessageToServer = (messageContent, chatId) => {
		messaging
			.post("/message", { content: messageContent, chatId })
			.then((res) => {
				if (res.data) {
					FetchChats();
					console.log(res.data.populatedMessage);
					socket.emit("new message", res.data.populatedMessage);
					setMessage([...messages, res.data.populatedMessage]);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const handleJoinRoom = useCallback(
		(id) => {
			console.log("id", id);
			setUserId(id);
			setLink({ video: true, link: `/room/${id}` });
			if (userId && isLink) {
				console.log(userId);
				sendMessageToServer(isLink, selectedUsers._id);
				Navigate(`/room/${userId}`);
			}
		},
		[Navigate, userId]
	);

	return (
		<>
			{selectedUsers ? (
				<div className="border-l  border-gray-600 p-3 w-[694px] md:w-[1110px] lg:w-[680px] max-h-full min-h-screen sm:w-[980px] dark:bg-black bg-white flex-col">
					{selectedUsers.isGroupChat ? (
						<>
							{!showGroupInfo ? (
								<>
									<div onClick={handleShowGroupInfo} className="flex cursor-pointer">
										<Avatar src={updatedImage || selectedUsers?.groupImage?.url}></Avatar>
										<h2 className="text-2xl ms-3 w-full font-semibold text-black dark:text-white"> 	{updatedName || selectedUsers?.chatName}</h2>
									</div>
									<div className=" overflow-y-auto">
										{/* <Link to={`/${selectedUsers?.chatName}`}> */}
										<div className=" mb-4  border-gray-600 ">
											<div className="mt-7">
												<img
													className="max-h-20 rounded-full mx-auto"
													src={updatedImage || selectedUsers?.groupImage?.url}
													alt=""
												/>
												<h1 className="text-center text-black dark:text-white text-[25px] font-semibold ">
													{updatedName || selectedUsers?.chatName}
												</h1>
											</div>
											{/* {isTyping ? (
												<div className="text-green-500 text-lg text-end">typing...</div>
											) : (
												<></>
											)} */}
										</div>
										{/* </Link> */}
										<div className="h-[470px]">
											<ScrollableChat user={user} messages={messages} />
										</div>
									</div>
								</>
							) : (
								<>
									<div className="flex pb-3">
											<button className="text-3xl text-black dark:text-white" onClick={handleShowGroupInfo}>
											<IoArrowBack />
										</button>
										<h2 className="ms-3 dark:text-gray-300 text-gray-600 text-2xl">Group Info</h2>
									</div>
									<div className="flex p-3 pb-5 border-b border-gray-500 mt-5 w-full items-center">
										<Avatar src={updatedImage || selectedUsers?.groupImage?.url} />
											<h2 className="ps-3 text-xl text-black dark:text-white flex-1">
											{updatedName || selectedUsers?.chatName}
										</h2>
									{console.log(user)}
										<button onClick={onOpen} className="text-purple-700">
											Edit
										</button>
									</div>
									<GroupInfoEditModal
										groupImage={updatedImage || selectedUsers?.groupImage?.url}
										chatName={updatedName || selectedUsers?.chatName}
										chatId={selectedUsers?._id}
										isOpen={isOpen}
										onClose={onClose}
										setUpdatedImage={setUpdatedImage}
										setUpdatedName={setUpdatedName}
									/>
										<h1 className="text-2xl font-bold text-black dark:text-white pt-5">Peoples</h1>
									<div className="h-[350px] overflow-y-auto border-b">
										{user?.map((u) => (
											<div className="flex p-3 pt-5 pb-5 items-center" key={u?._id}>
												<Avatar src={u?.propic?.url} />
												<div className="ml-4">
													<h2 className="text-black dark:text-white font-semibold text-lg">{u?.name}</h2>
													<h2 className="text-gray-400">@{u?.username}</h2>
												</div>
												{/* <div className="ml-auto">
													<button className="bg-blue-500 hover:bg-blue-700 text-black dark:text-white font-bold py-2 px-4 rounded">
														Follow
													</button>
												</div> */}
											</div>
										))}
										<div className="flex">
											<button
												onClick={onListUserOpen}
												className="mx-auto text-purple-700 text-lg mt-4">
												Add People
											</button>
										</div>
									</div>
									{console.log(selectedUsers)}
									<UsersSearchModal
										chatId={selectedUsers?._id}
										userss={selectedUsers.users}
										onClose={onListUserClose}
										isOpen={isListUserOpen}
										fetchMessages={fetchMessages}
									/>
									<button
										onClick={onAlertOpen}
										className="mt-14 h-10 w-full  hover:bg-red-900/20 text-red-700 transition-opacity duration-300">
										Leave this Conversation
									</button>
									<AlertLeaveGroup
										chatId={selectedUsers?._id}
										userId={userdetails._id}
										onClose={onAlertClose}
										isOpen={isAlertOpen}
										FetchChats={FetchChats}
									/>
								</>
							)}
						</>
					) : (
						<>
							{" "}
							<div className="flex w-full lg:ml-0  ml-20 sm:ml-80">
									<h2 className="text-2xl font-semibold text-black dark:text-white ">{otherUser?.name}</h2>
								<div
									onClick={() => handleJoinRoom(otherUser._id)}
										className="dark:text-white text-black ps-[20px] items-start">
									<CiVideoOn className="w-8 h-8 cursor-pointer" />
								</div>
							</div>
							<div className="overflow-y-auto">
								<Link to={`/${otherUser?.username}`}>
									<div className="h-[285px] mb-4 sm:ml-60 ml-0 lg:ml-0 hover:bg-zinc-900 border-gray-600 border-b">
										<div className="mt-10">
											<img
												className="max-h-20 rounded-full mx-auto"
												src={otherUser?.propic?.url}
												alt=""
											/>
												<h1 className="text-center text-black dark:text-white text-[22px] font-semibold ">
												{chatdata?.user1?.name}
											</h1>
											<h2 className="text-center text-gray-500 pb-4">@{otherUser?.username}</h2>
											<h1 className="text-center text-gray-500 pb-5">{otherUser?.bio}</h1>
											<h1 className="text-center text-gray-500 pb-5">
												{formatJoinDate(otherUser?.createdAt)}
											</h1>
										</div>
										{isTyping ? (
											<div className="text-green-500 text-lg text-end">typing...</div>
										) : (
											<></>
										)}
									</div>
								</Link>
								<div className="h-[315px]">
									<ScrollableChat user={user} messages={messages} />
								</div>
							</div>
						</>
					)}
					{!showGroupInfo && (
						<div className="relative" onKeyDown={(e) => e.key === "Enter" && SendMessage()}>
							<input
								value={newMessage}
								placeholder="Message"
								className={`w-[640px] absolute pl-14 text-purple-600 bg-dimBlue h-14 rounded-2xl ${
									selectedUsers.isGroupChat ? "top-[15px]" : "top-0"
								}`}
								type="text"
								onChange={typingHandler}
							/>
							<svg
								onClick={openEmoji}
								aria-label="Choose an emoji"
								className={`absolute text-purple-600 top-3 left-4 cursor-pointer ${
									selectedUsers.isGroupChat ? "top-[25px]" : "top-0"
								}`}
								fill="currentColor"
								height="30"
								role="img"
								viewBox="0 0 24 24"
								width="30">
								<title>Choose an emoji</title>
								<path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
							</svg>
							<button
								onClick={SendMessage}
								className={`absolute  right-8 text-3xl font-semibold text-purple-600  ${
									selectedUsers.isGroupChat ? "top-[25px]" : "top-4"
								}`}>
								<PiPaperPlaneLight />
							</button>
							{emojishow && (
								<div className="fixed transform -translate-x-1/2 -translate-y-1/2 top-[470px] right-36">
									<EmojiPicker onEmojiClick={addEmoji} />
								</div>
							)}
						</div>
					)}
				</div>
			) : (
				<>
						<div className="border-l border-gray-600 lg:flex hidden p-4 w-[694px] md:w-[1110px] lg:w-[680px] h-screen sm:w-[980px] dark:bg-black bg-white flex-col justify-center items-center">
							<h2 className="dark:text-white text-black font-sans text-4xl font-bold">Select a message</h2>
						<p className="text-gray-400">
							Choose from your existing conversations, start a new one by searching
						</p>
					</div>
				</>
			)}
		</>
	);
};
export default Chat;
