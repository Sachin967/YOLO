import { Avatar, Tooltip } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../config/ChatLogics";
import { useEffect, useRef } from "react";
const ScrollableChat = ({ messages ,user}) => {
	const { userdetails } = useSelector((state) => state.auth);
	const messagesEndRef = useRef(null);
	  const scrollToBottom = () => {
			messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
		};
		useEffect(() => {
			scrollToBottom(); 
		}, [messages]);
	return (
		<div className="h-[315px]">
			{console.log(messages)}
			{messages &&
				messages.map((message, index) => {
					const isSentByCurrentUser = message.senderId === userdetails._id;
					const sender = user.find((u) => u._id === message.senderId); // Find the user who sent the message
					return (
						<div style={{ display: "flex" }} key={index}>
							{message.chatId.isGroupChat ? (
								<>
									{" "}
									{isSentByCurrentUser && (
										<div className="w-full flex">
											<p className="ml-[490px] px-4 py-2 bg-purple-500  text-white rounded-3xl mb-2 min-w-max max-w-[100px] break-words">
												{message?.content}
											</p>
										</div>
									)}
									{/* For messages sent by other users */}
									{!isSentByCurrentUser && sender && (
										<div style={{ display: "flex" }}>
											{/* Display avatar */}
											<Avatar
												size={"md"}
												className="mb-2 mr-1"
												src={
													sender?.propic?.url || "https://www.example.com/default-avatar.png"
												}
											/>

											<p className=" text-white bg-zinc-700 px-4 py-2 rounded-3xl mb-2 min-w-min max-w-[300px] whitespace-normal break-words">
												{message.content}
											</p>
										</div>
									)}
								</>
							) : (
								<>
									{isSentByCurrentUser && (
										<p className="ms-[525px] text-white  bg-purple-500 px-4 py-2 rounded-3xl mb-2 min-w-min max-w-[300px] whitespace-normal break-words">
											{message.content}
										</p>
									)}

									<div>{/* Display message content */}</div>
									<div className="w-full flex">
										{!isSentByCurrentUser && (
											<>
												<Avatar
													size={"md"}
													className="mb-2 mr-1"
													src={
														user[0]?.propic?.url ||
														"https://www.google.com/imgres?imgurl=https%3A%2F%2Fgogaffl-public.s3-us-west-2.amazonaws.com%2Fdefault-pro-pic.jpg&tbnid=-oHlEZz7pbEn2M&vet=12ahUKEwiolfue85-DAxVCSmwGHdJ2BjUQMygDegQIARA5..i&imgrefurl=https%3A%2F%2Fwww.gogaffl.com%2Ftrips%2Fa-trip-around-the-uk&docid=tv5tsAVDNWnqZM&w=1000&h=1000&itg=1&q=default%20propic&ved=2ahUKEwiolfue85-DAxVCSmwGHdJ2BjUQMygDegQIARA5"
													}
												/>
												<p className="mr-[595px] px-4 py-2 bg-zinc-700 text-white  rounded-3xl mb-2 min-w-max max-w-[100px] break-words">
													{message?.content}
												</p>
											</>
										)}
									</div>
								</>
							)}

							{/* For current user, display avatar on the right */}
						</div>
					);
				})}
			<div ref={messagesEndRef} />
		</div>
	);
};
export default ScrollableChat;
