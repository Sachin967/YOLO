import {
	Avatar,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { ENDPOINT } from "../../constants/constant";
import { useEffect, useState } from "react";
import { messaging } from "../../config/axios";
var socket, selectedChatCompare;
const ShareModal = ({ onClose, isOpen, post }) => {
	const { peopleMessaged, people, selectedUsers, setSelectedUsers, fetchAgain, setFetchAgain } = ChatState();
	const { userdetails } = useSelector((state) => state.auth);
	const { notification, setNotification } = ChatState();
	const [messages, setMessage] = useState([]);
	const [newMessage, setNewMessage] = useState();
	const [selectedChatId, setSelectedChatId] = useState(null);
	useEffect(() => {
		setNewMessage(post);
		socket = io(ENDPOINT);
		socket.emit("setup", userdetails);
		socket.on("connected");
	}, []);

	const SendMessage = () => {
		// setNewMessage("");
		console.log(newMessage);
		messaging
			.post("/message", { content: newMessage, chatId: selectedUsers._id })
			.then((res) => {
				if (res.data) {
					console.log(res.data.populatedMessage);
					socket.emit("new message", res.data.populatedMessage);
					setMessage([...messages, res.data.populatedMessage]);
					onClose();
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	useEffect(() => {
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
	const handleChatSelection = (chat) => {
		setSelectedChatId(chat._id === selectedChatId ? null : chat._id);
	};
	return (
		<Modal onClose={onClose} size={"xl"} isOpen={isOpen}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader className="text-center w-full text-white border-b">Share</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{peopleMessaged?.map((chat) => {
						const otherUser = people.find(
							(user) => chat.users.includes(user._id) && user._id !== userdetails._id
						);
						const isSelected = chat._id === selectedChatId;
						return (
							<div
								onClick={() => {
									setSelectedUsers(chat);
									handleChatSelection(chat);
								}}
								className={`flex w-full cursor-pointer ${isSelected ? "bg-zinc-700" : ""}`}
								key={chat._id}>
								{chat.isGroupChat ? (
									<>
										<Avatar className="m-5" src={chat?.groupImage?.url} />
										<h2 className="mt-5 me-2 text-lg text-white font-bold">{chat?.chatName}</h2>
									</>
								) : (
									<>
										<Avatar className="m-5" src={otherUser?.propic?.url} />
										<h2 className="mt-5 me-2 text-lg text-white font-bold">{otherUser?.name}</h2>
										<h2 className="mt-5 me-2 text-lg text-gray-400 font-normal">
											@{otherUser?.username}
										</h2>
									</>
								)}
							</div>
						);
					})}
				</ModalBody>
				{console.log(peopleMessaged)}
				<ModalFooter>
					<Button className="w-full" onClick={SendMessage}>
						Send
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default ShareModal;
