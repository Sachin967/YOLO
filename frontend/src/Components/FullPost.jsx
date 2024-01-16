import {
	Avatar,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Popover,
	PopoverArrow,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
	Text,
	useDisclosure
} from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { modalTheme } from "../config/ChakraModalconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEllipsis, faFaceSurprise, faHeart, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { posts, users } from "../config/axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCustomToast from "../config/toast";
import { Link, useNavigate } from "react-router-dom";
import OptionModal from "./Modals/OptionModal";
import { AuthActions } from "../store/Authslice";
import { Error403 } from "../Commonfunctions";
import { ImBookmark } from "react-icons/im";
import { GrBookmark } from "react-icons/gr";
import { CommentDeleteModal } from "./Modals/CommentDeleteModal";

const FullPost = ({
	likeCount,
	savepost,
	PostSave,
	postId,
	handleLike,
	like,
	onClosePostModal,
	isPostModalOpen,
	poster,
	postuser
}) => {
	const { isOpen: isBasicOpen, onOpen: onBasicOpen, onClose: onBasicClose } = useDisclosure();
	const showToast = useCustomToast();
	const [com, setCom] = useState("");
	const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
	const [emojishow, setEmojishow] = useState(false);
	const { userdetails } = useSelector((state) => state.auth);
	const usrname = userdetails.username;
	const [post, setPosts] = useState([]);
	const [specificPost, setSpecificPost] = useState([]);
	const [userData, setUserData] = useState(null);
	const [replyText, setReplyText] = useState("");
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const [comments, setComment] = useState([]);
	const [commentId, setCommentId] = useState("");
	const SinglePostDetails = () => {
		posts
			.post("/postdetails", { postId })
			.then((res) => {
				console.log(res.data);
				const { post: post, userData } = res.data.response;
				// Match user data for each post based on user IDs
				const commentWithUserData = post.comments.map((comment) => {
					const userDetail = userData.find((user) => {
						return user?.username.toLowerCase() == comment?.username.toLowerCase();
					});
					console.log(userDetail);
					return { ...comment, ...userDetail };
				});
				setComment(commentWithUserData);
			})
			.catch((error) => {
				if (error.response && error.response.status === 403) {
					// Handle 403 Forbidden error
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};

	const FetchPosts = () => {
		posts
			.get(`/fetchUserPosts/${userdetails._id}`)
			.then((res) => {
				if (res.data) {
					setPosts(res.data);
				}
			})
			.catch((error) => {
				if (error.response.status === 403) {
					// Handle 403 Forbidden error
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};

	useEffect(() => {
		SinglePostDetails();
		FetchPosts();
	}, [likeCount]);
	const containsPostId = post.some((p) => p._id === postId);
	useEffect(() => {
		const specificpost = post.find((p) => p._id === postId);

		setSpecificPost(specificpost);
		extractUserData();
	}, [postId, post, postuser]);

	const extractUserData = async () => {
		if (typeof postuser === "function") {
			try {
				console.log("b");
				const resolvedUserData = await postuser();
				setUserData(resolvedUserData);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setUserData(null);
			}
		} else if (postuser instanceof Promise) {
			console.log("a");
			const resolvedUserData = await postuser;
			setUserData(resolvedUserData);
			try {
				const resolvedUserData = await postuser;
				setUserData(resolvedUserData);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setUserData(null);
			}
		} else if (typeof postuser === "object" && postuser !== null) {
			setUserData(postuser);
		} else {
			setUserData(null);
		}
	};

	const openEmoji = () => {
		setEmojishow((prevEmojiShow) => !prevEmojiShow);
	};
	const addEmoji = (selectedEmoji) => {
		setCom((prevText) => prevText + selectedEmoji.emoji);
	};
	const handleComment = () => {
		const data = {
			content: com,
			username: usrname,
			postId: postId
		};
		posts
			.post("/addcomment", data)
			.then((res) => {
				if (res.data.status) {
					setCom("");
					SinglePostDetails();
					showToast("success", "Comment added");
				}
			})
			.catch((error) => {
				if (error.response.status === 403) {
					// Handle 403 Forbidden error
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};
	const ReplyComment = (id) => {
		try {
			posts
				.post("/commentreply", { commentId: id, replyText, username: usrname })
				.then((res) => {
					if (res.data) {
						SinglePostDetails();
						setReplyText("");
						showToast("success", "Replied");
					}
				})
				.catch((error) => {
					if (error.response.status === 403) {
						// Handle 403 Forbidden error
						Error403(error, showToast, dispatch, Navigate);
					} else {
						console.error("Error:", error);
					}
				});
		} catch (error) {}
	};
	const formatDate = (dateString) => {
		const options = {
			day: "2-digit",
			month: "short",
			year: "numeric",
			timeZone: "Asia/Kolkata" // Set the Indian time zone
		};
		const formattedDate = new Date(dateString).toLocaleDateString("en-US", options);
		return formattedDate;
	};
	const handleClick = (coId) => {
		console.log(coId);
		onAlertOpen();
		setCommentId(coId);
	};
	return (
		<div>
			<Modal
				variant=""
				motionPreset="scale"
				className=""
				onClose={onClosePostModal}
				size="full"
				isOpen={isPostModalOpen}>
				<ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
				<ModalContent style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}>
					<ModalHeader bg="black" className="px-0 bg-transparent py-0">
						<ModalCloseButton className="hover:text-white" />
					</ModalHeader>
					<ModalBody bg={"black"} className="flex  bg-transparent justify-center relative">
						<img className="w-[550px]  mr-60 h-[687px]" src={poster?.media} alt="" />
						<div className="absolute flex top-5 right-0  text-white border-t border-l border-zinc-700  overflow-y-scroll max-h-[535px]">
							<div className="flex flex-col w-[350px] h-screen">
								<div className="flex items-center p-3">
									<Avatar className="m-1" name="Dan Abrahmov" src={userData?.propic?.url} />
									<div>
										<a href={`/${userData?.username}`}>
											{" "}
											<Heading className="" size="md">
												{userData?.username}
											</Heading>
										</a>
										<h1 className="text-white  w-40">
											{specificPost?.location || poster?.location}
										</h1>
									</div>
									<FontAwesomeIcon
										onClick={onBasicOpen}
										className="ml-20 text-2xl cursor-pointer"
										icon={faEllipsis}
									/>
								</div>
								{/* Text content here */}
								<div className="p-2 border-b border-zinc-700">
									<Text className="font-poppins font-light text-lg">
										{specificPost?.textmedia || poster?.textmedia}
									</Text>
								</div>
								{/* Iterate through comments */}
								{comments.length > 0 &&
									comments?.map((comment) => (
										<div key={comment._id} className="p-2 ">
											<div className="flex text-dimWhite">
												<a href={`/${comment?.username}`} className="flex ">
													<Avatar
														className="m-1"
														name="Dan Abrahmov"
														src={comment?.propic?.url}
													/>
													<Text className="p-2 font-bold text-sm">{comment?.name}</Text>
												</a>
												<Text className="p-2 text-sm">{formatDate(comment?.createdAt)}</Text>
												<FontAwesomeIcon
													onClick={() => handleClick(comment._id)}
													className="text-xl p-2"
													icon={faEllipsis}
												/>
											</div>

											<div className="flex">
												<Text className="ml-16 text-md">{comment?.content}</Text>
												<Popover>
													<PopoverTrigger>
														<button className="font-semibold text-sm ml-4 text-gray-500 hover:text-white">
															Reply
														</button>
													</PopoverTrigger>
													<PopoverContent style={{ backgroundColor: "#262626" }}>
														<PopoverArrow />
														<PopoverCloseButton />
														<textarea
															value={
																replyText.startsWith(`@${comment?.username}`)
																	? replyText
																	: `${replyText}`
															}
															className="bg-neutral-700 rounded-r-xl"
															rows={3}
															onChange={(e) => setReplyText(e.target.value)}
															placeholder={`Replying to @${comment?.username}`}
														/>
														<button onClick={() => ReplyComment(comment._id)}>Post</button>
													</PopoverContent>
												</Popover>
											</div>
											{comment?.replies?.length > 0 && (
												<>
													<Popover>
														<PopoverTrigger>
															<button className="ms-16 text-sm text-gray-400 my-3 hover:underline">
																-View Replies
															</button>
														</PopoverTrigger>

														<PopoverContent
															style={{
																backgroundColor: "#262626",
																marginLeft: "20px",
																maxWidth: "200px"
															}}
															className="absolute left-12">
															<div className=" mx-3">
																{comment?.replies.map((reply, index) => (
																	<div key={index} className="flex flex-col mb-3">
																		<Link to={`/${reply?.username}`}>
																			<h2 className="dark:text-white text-black text-base font-bold">
																				{reply?.username}
																			</h2>
																		</Link>
																		<h2 className="text-text text-sm">
																			{reply?.replyText}
																		</h2>
																	</div>
																))}
															</div>
														</PopoverContent>
													</Popover>
												</>
											)}
										</div>
									))}
								<CommentDeleteModal
									comments={comments}
									setComment={setComment}
									commentId={commentId}
									containsPostId={containsPostId}
									onClose={onAlertClose}
									isOpen={isAlertOpen}
								/>
							</div>
						</div>
						<div className=" w-[351px]  border-l border-t border-zinc-700 absolute bottom-0 right-0">
							{" "}
							<div className="flex p-3 justify-between">
								<FontAwesomeIcon
									onClick={() => handleLike(postId)}
									className={`text-3xl transition-transform cursor-pointer p-3 ${
										like ? "text-red-700 scale-125" : "text-gray-200"
									}`}
									icon={faHeart}
								/>
								{/* <FontAwesomeIcon className="text-2xl p-2" icon={faPaperPlane} /> */}
								{/* <FontAwesomeIcon className="text-2xl p-2" icon={faBookmark} /> */}
								<div onClick={() => PostSave(postId)} className="inline-block">
									{savepost ? (
										<ImBookmark
											icon={faBookmark}
											className="cursor-pointer scale-105 h-14 w-14 p-3 transition-transform text-blue-500"
										/>
									) : (
										<GrBookmark className="cursor-pointer h-14 w-14 p-3 transition-transform text-gray-300" />
									)}
								</div>
							</div>
							<Text className="font-semibold text-2xl dark:text-white text-black ml-8 mb-3">
								{" "}
								{likeCount}
							</Text>
							<div className="">{emojishow && <EmojiPicker onEmojiClick={addEmoji} />}</div>
							<div className="flex p-3 border-t border-b border-3 border-zinc-700 justify-between items-center">
								<FontAwesomeIcon
									onClick={openEmoji}
									className="p-2 text-2xl dark:text-white text-black"
									icon={faFaceSurprise}
								/>
								<textarea
									className="bg-transparent w-full border-none rounded-2xl text-white  resize-y overflow-hidden focus:bg-slate-900"
									type="text"
									placeholder="Post your reply"
									value={com} // Set the value of the textarea to the state variable
									onChange={(e) => setCom(e.target.value)} // Update the state with the new value
								/>
								<button onClick={handleComment} className="text-gray-500 font-bold px-4 rounded-md">
									Post
								</button>
							</div>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
			<OptionModal
				isOpen={isBasicOpen}
				postId={postId}
				onClosePostModal={onClosePostModal}
				onClose={onBasicClose}
				containsPostId={containsPostId}
				specificPost={specificPost}
				setSpecificPost={setSpecificPost}
				setPosts={setPosts}
				username={postuser?.username}
				image={poster?.media}
				FetchPosts={FetchPosts}
			/>
		</div>
	);
};
export default FullPost;
