import { Avatar, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SavePost, fetchLikedPost, fetchSavedPost } from "../API/api";
import { ChatState } from "../Context/ChatProvider";
import useCustomToast from "../toast";
import FullPost from "./FullPost";
const ScrollableChat = ({ messages, user }) => {
	const { userdetails } = useSelector((state) => state.auth);
	const messagesEndRef = useRef(null);
	const [like, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState();
	const [savepost, setSavePost] = useState(false);
	const { setSavedPost } = ChatState();
	const Navigate = useNavigate();
	const dispatch = useDispatch();
	const showToast = useCustomToast();
	const { isOpen: isPostModalOpen, onOpen: onOpenPostModal, onClose: onClosePostModal } = useDisclosure();
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
	};

	const PostSave = async (postId) => {
		try {
			const fetchedPosts = await SavePost({ postId, id });
			setSavePost(fetchedPosts);
			fetchSavedPost(setSavedPost, id);
		} catch (error) {
			console.log(error);
		}
	};

	const likeFunction = (_id) => {
		handleLike(id, _id, setLikeCount, setLiked, fetchLikedPost, showToast, dispatch, Navigate);
	};
	useEffect(() => {
		scrollToBottom();
	}, [messages]);
	return (
		<>
			{messages &&
				messages.map((message, index) => {
					const isSentByCurrentUser = message.senderId === userdetails._id;
					const sender = user.find((u) => u._id === message.senderId); // Find the user who sent the message
					const isSharedPost = typeof message.content === "object";
					return (
						<div style={{ display: "flex" }} key={index}>
							{message.chatId.isGroupChat ? (
								<>
									{" "}
									{isSentByCurrentUser && (
										<div className="">
											{isSharedPost ? (
												<>
													<div className="relative ml-[340px] w-[300px] h-[350px]">
														<img
															onClick={onOpenPostModal}
															className="rounded-xl"
															src={message.content?.media?.url}
															alt=""
														/>
														<FullPost
															postId={message.content?._id}
															handleLike={likeFunction}
															like={like}
															onClosePostModal={onClosePostModal}
															isPostModalOpen={isPostModalOpen}
															likeCount={likeCount}
															poster={message.content}
															postuser={message?.content?.userDetails}
															savepost={savepost}
															PostSave={PostSave}
														/>
														<div className="absolute top-3 left-3  p-2 rounded-b-xl">
															<div className="flex items-center">
																<Link to={`/${message.content?.userDetails?.username}`}>
																	<Avatar
																		src={message.content?.userDetails?.propic?.url}
																		size="sm"
																		className="mr-2"
																	/>
																	<span className="text-base font-semibold text-white">
																		{message.content?.userDetails?.username}
																	</span>
																</Link>
															</div>
														</div>
													</div>
												</>
											) : (
												<>
													{" "}
													<p className="ml-[490px] px-4 py-2 bg-purple-500  text-white rounded-3xl mb-2 min-w-max max-w-[100px] break-words">
														{message?.content}
													</p>
												</>
											)}
										</div>
									)}
									{/* For messages sent by other users */}
									{!isSentByCurrentUser && sender && (
										<div style={{ display: "flex" }}>
											<Avatar
												size={"md"}
												className="mb-2 mr-1"
												src={
													sender?.propic?.url || "https://www.example.com/default-avatar.png"
												}
											/>
											{isSharedPost ? (
												<>
													<div className="relative w-[300px] h-[350px]">
														<img
															onClick={onOpenPostModal}
															className="rounded-xl"
															src={message.content?.media?.url}
															alt=""
														/>
														<FullPost
															postId={message.content?._id}
															handleLike={likeFunction}
															like={like}
															onClosePostModal={onClosePostModal}
															isPostModalOpen={isPostModalOpen}
															likeCount={likeCount}
															poster={message.content}
															postuser={message?.content?.userDetails}
															savepost={savepost}
															PostSave={PostSave}
														/>
														<div className="absolute top-3 left-3  p-2 rounded-b-xl">
															<div className="flex items-center">
																<Link to={`/${message.content?.userDetails?.username}`}>
																	<Avatar
																		src={message.content?.userDetails?.propic?.url}
																		size="sm"
																		className="mr-2"
																	/>
																	<span className="text-base font-semibold text-white">
																		{message.content?.userDetails?.username}
																	</span>
																</Link>
															</div>
														</div>
													</div>
												</>
											) : (
												<>
													<p className=" text-white bg-zinc-700 px-4 py-2 rounded-3xl mb-2 min-w-min max-w-[300px] whitespace-normal break-words">
														{message.content}
													</p>
												</>
											)}
										</div>
									)}
								</>
							) : (
								// {=================================================================}
								<>
									{isSentByCurrentUser &&
										(isSharedPost ? (
											message.content.video ? (
												<>
													<div className="text-white ms-[530px] py-2 px-4 bg-purple-500  rounded-3xl mb-2">
														<p className="font-bold">Video Call</p>
														<button onClick={() => Navigate(message.content.link)}>
															Join
														</button>
													</div>
												</>
											) : (
												<>
													<div className="relative ml-[390px] w-[300px] h-[350px]">
														<img
															onClick={onOpenPostModal}
															className="rounded-xl"
															src={message.content?.media?.url}
															alt=""
														/>
														<FullPost
															postId={message.content?._id}
															handleLike={likeFunction}
															like={like}
															onClosePostModal={onClosePostModal}
															isPostModalOpen={isPostModalOpen}
															likeCount={likeCount}
															poster={message.content}
															postuser={message?.content?.userDetails}
															savepost={savepost}
															PostSave={PostSave}
														/>
														<div className="absolute top-3 left-3  p-2 rounded-b-xl">
															<div className="flex items-center">
																<Link to={`/${message.content?.userDetails?.username}`}>
																	<Avatar
																		src={message.content?.userDetails?.propic?.url}
																		size="sm"
																		className="mr-2"
																	/>
																	<span className="text-base font-semibold text-white">
																		{message.content?.userDetails?.username}
																	</span>
																</Link>
															</div>
														</div>
													</div>
												</>
											)
										) : (
											<>
												{" "}
												<p className="ms-[525px] text-white  bg-purple-500 px-4 py-2 rounded-3xl mb-2 min-w-min max-w-[300px] whitespace-normal break-words">
													{message.content}
												</p>
											</>
										))}
									{!isSentByCurrentUser && (
										<div className="w-full flex">
											<>
												<Avatar
													size={"md"}
													className="mb-2 mr-1"
													src={
														user[0]?.propic?.url ||
														"https://www.google.com/imgres?imgurl=https%3A%2F%2Fgogaffl-public.s3-us-west-2.amazonaws.com%2Fdefault-pro-pic.jpg&tbnid=-oHlEZz7pbEn2M&vet=12ahUKEwiolfue85-DAxVCSmwGHdJ2BjUQMygDegQIARA5..i&imgrefurl=https%3A%2F%2Fwww.gogaffl.com%2Ftrips%2Fa-trip-around-the-uk&docid=tv5tsAVDNWnqZM&w=1000&h=1000&itg=1&q=default%20propic&ved=2ahUKEwiolfue85-DAxVCSmwGHdJ2BjUQMygDegQIARA5"
													}
												/>
												{isSharedPost ? (
													message?.content?.video ? (
														<>
															{" "}
															<div className="text-white mr-[500px] py-2 px-4 bg-zinc-700 rounded-3xl mb-2 ">
																<p className="font-bold w-[100px]">Video Call</p>
																<button onClick={() => Navigate(message.content.link)}>
																	Join
																</button>
															</div>
														</>
													) : (
														<>
															<div className="relative mr-[340px] w-[300px] h-[350px]">
																<img
																	onClick={onOpenPostModal}
																	className="rounded-xl"
																	src={message.content?.media?.url}
																	alt=""
																/>
																<FullPost
																	postId={message.content?._id}
																	handleLike={likeFunction}
																	like={like}
																	onClosePostModal={onClosePostModal}
																	isPostModalOpen={isPostModalOpen}
																	likeCount={likeCount}
																	poster={message.content}
																	postuser={message?.content?.userDetails}
																	savepost={savepost}
																	PostSave={PostSave}
																/>
																<div className="absolute top-3 left-3  p-2 rounded-b-xl">
																	<div className="flex items-center">
																		<Link
																			to={`/${message.content?.userDetails?.username}`}>
																			<Avatar
																				src={
																					message.content?.userDetails?.propic
																						?.url
																				}
																				size="sm"
																				className="mr-2"
																			/>
																			<span className="text-base font-semibold text-white">
																				{message.content?.userDetails?.username}
																			</span>
																		</Link>
																	</div>
																</div>
															</div>
														</>
													)
												) : (
													<>
														{" "}
														<p className="mr-[595px] px-4 py-2 bg-zinc-700 text-white  rounded-3xl mb-2 min-w-max max-w-[100px] break-words">
															{message?.content}
														</p>
													</>
												)}
											</>
										</div>
									)}
								</>
							)}
						</div>
					);
				})}
			<div ref={messagesEndRef} />
		</>
	);
};
export default ScrollableChat;
