import { Flex, Avatar, Box, Heading, Text, Image } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { posts, users } from "../config/axios";
import { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import FullPost from "./FullPost";
import useCustomToast from "../toast";
import CommentModal from "./Modals/CommentModal";
import { CiHeart } from "react-icons/ci";
import { GrBookmark } from "react-icons/gr";
import { ImBookmark } from "react-icons/im";
import { SavePost, fetchLikedPost, fetchSavedPost, handleLike } from "../API/api";
import { ChatState } from "../Context/ChatProvider";
import ShareModal from "./Modals/ShareModal";
const PostView = ({ post, ShowPosts, fetchData }) => {
	const [like, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState();
	const [savepost, setSavePost] = useState(false);
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const { isOpen: isCommentModalOpen, onOpen: onCommentModal, onClose: onCloseCommentModal } = useDisclosure();
	const { isOpen: isPostModalOpen, onOpen: onOpenPostModal, onClose: onClosePostModal } = useDisclosure();
	const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
	const { media, textmedia, _id, likes, comments } = post;
	const { name, username, propic } = post?.userDetails || {};
	const { userdetails } = useSelector((state) => state.auth);
	const id = userdetails._id;
	const { savedpost, setSavedPost } = ChatState();
	const handleCommentClick = () => {
		onCommentModal();
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
		fetchLikedPost(id, post._id, setLiked);
	}, [post._id, id, setLiked]);

	const handleClick = () => {
		onOpenPostModal();
	};
	return (
		<>
			<div className="ml-[70px] w-[380px] md:w-[1110px] lg:w-[1120px] sm:w-[980px] lg:ml-[320px] sm:ml-[55px] bg-black">
				<div className=" sm:p-4 border-r border-b border-gray-700 sm:ml-80 lg:ml-0 dark:border-gray-700 max-w-[750px] ">
					<div className="flex items-center justify-center h-[550px]  sm:h-[750px] mb-11 rounded bg-black dark:bg-gray-900">
						<Flex className="flex-0 sm:flex-1" gap="4" alignItems="center" flexWrap="wrap">
							<a href={`/${username}`}>
								{" "}
								<Avatar src={propic?.url} name="Segun Adebayo" className="mb-[450px] sm: sm:mb-[650px]" />
							</a>
							<Box>
								<a href={`/${username}`}>
									<Heading className="text-white mt-16" size="sm">
										{name}
									</Heading>
								</a>

								<a href={`/${username}`}>
									<a className="text-gray-500">@{username}</a>
								</a>
								<Text className="text-white mt-5">{textmedia}</Text>
								{media && (
									<Image
										onClick={handleClick}
										className="rounded-3xl w-full object-cover h-[375px]  sm:w-[480px] sm:h-[600px]"
										objectFit="cover"
										src={media}
										alt="Chakra UI"
									/>
								)}
								<div className="flex justify-around w-full">
									<div
										className="cursor-pointer"
										style={{ position: "relative" }}
										onClick={() => likeFunction(_id)}>
										{like ? (
											<FontAwesomeIcon
												className="text-red-700 scale-125 text-3xl transition-transform p-4"
												icon={faHeart}
											/>
										) : (
											<CiHeart className="text-white h-16 w-16 transition-transform p-3 " />
										)}
										<div className="absolute bottom-10 left-[60px]">
											<span
												className={`text-base transition-transform font-semibold ${
													like ? "text-red-700" : "text-gray-300"
												}`}>
												{likeCount || likes.length}
											</span>
										</div>
									</div>
									<div>
										<button onClick={handleCommentClick}>
											<FontAwesomeIcon
												className="text-3xl p-4 text-gray-200  hover:text-blue-500"
												icon={faComment}
											/>
											<div className="relative bottom-11 left-[40px]">
												<span
													className={`text-base transition-transform font-semibold text-white`}>
													{comments?.length > 0 && comments?.length}
												</span>
											</div>
										</button>
									</div>
									<div className="cursor-pointer p-4" onClick={onShareOpen}>
										<FontAwesomeIcon
											icon={faArrowUpFromBracket}
											className="text-3xl  text-gray-300"
										/>
										<ShareModal
											post={post}
											isOpen={isShareOpen}
											onClose={onShareClose}
										/>
									</div>
									<div onClick={() => PostSave(_id)} className="inline-block">
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
							</Box>
						</Flex>
					</div>
				</div>
			</div>
			<CommentModal
				fetchData={fetchData}
				ShowPosts={ShowPosts}
				PostUserdetails={post?.userDetails}
				isCommentModalOpen={isCommentModalOpen}
				onCloseCommentModal={onCloseCommentModal}
				post={post}
			/>
			<FullPost
				postId={_id}
				handleLike={likeFunction}
				like={like}
				onClosePostModal={onClosePostModal}
				isPostModalOpen={isPostModalOpen}
				likeCount={likeCount}
				poster={post}
				postuser={post?.userDetails}
				savepost={savepost}
				PostSave={PostSave}
			/>
		</>
	);
};
export default PostView;
