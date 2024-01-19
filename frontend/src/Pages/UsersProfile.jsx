import {
	Avatar,
	Heading,
	Modal,
	ModalContent,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useDisclosure
} from "@chakra-ui/react";
import { faComment, faEllipsis, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditProfileDrawer from "../Components/Modals/EditProfileDrawer";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { posts, users } from "../config/axios";
import { useDispatch, useSelector } from "react-redux";
import useCustomToast from "../config/toast";
import FollowersModal from "../Components/Modals/FollowersModal";
import FollowingModal from "../Components/Modals/FollowingModal";
import ReportUserModal from "../Components/Modals/ReportUserModal";
import { modalTheme } from "../config/ChakraModalconfig";
import { SavePost, fetchLikedPost, fetchSavedPost, handleLike } from "../API/api";
import { ChatState } from "../Context/ChatProvider";
import FullPost from "../Components/FullPost";

const UsersProfile = () => {
	const [user, setUser] = useState({});
	const [post, setPosts] = useState([]);
	const [likedPost, setLikedPost] = useState({});
	const [follow, setFollow] = useState(false);
	const [reqested, setRequested] = useState(false);
	const [hoveredPostId, setHoveredPostId] = useState(null);
	const [activeTab, setActiveTab] = useState(0);
	const { username } = useParams();
	const { userdetails } = useSelector((state) => state.auth);
	const id = userdetails._id;
	const isCurrentUser = userdetails.username === username;
	const { isOpen: isFollowingOpen, onOpen: onFollowingOpen, onClose: onFollowingClose } = useDisclosure();
	const { isOpen: isFollowersOpen, onOpen: onFollowersOpen, onClose: onFollowersClose } = useDisclosure();
	const { isOpen: isOptionOpen, onOpen: onOptionOpen, onClose: onOptionClose } = useDisclosure();
	const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
	const { isOpen: isPostModalOpen, onOpen: onOpenPostModal, onClose: onClosePostModal } = useDisclosure();
	const { isOpen: isModalPostOpen, onOpen: onPostModalOpen, onClose: onPostModalClose } = useDisclosure();
	const Navigate = useNavigate();
	const dispatch = useDispatch();
	const showToast = useCustomToast();
	const { setSavedPost } = ChatState();
	const [likeCount, setLikeCount] = useState();
	const [like, setLiked] = useState(false);
	const [savepost, setSavePost] = useState(false);
	const [isPrivate, setIsPrivate] = useState(false);
	const isEmpty = (user) => {
		return Object.keys(user).length === 0;
	};
	useEffect(() => {
		// Update follow state when the user object is available
		const emp = isEmpty(user);
		console.log("kk");
		if (!emp) {
			console.log("hii");
			setFollow(user?.followers.includes(userdetails._id));
			setRequested(user?.followRequests.includes(userdetails._id));
		}
	}, [user, userdetails._id]);
	const HandleMessageClick = (userId) => {
		Navigate(`/messages/${userId}`);
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
	const showUserProfile = () => {
		try {
			users
				.get(`/profile/${username}`)
				.then((res) => {
					if (res.data) {
						setUser(res.data.user);
						setIsPrivate(res.data.user.isPrivate);
						setPosts(res.data.response.posts);
						setLikedPost(res.data.response.likedposts);
					}
				})
				.catch((error) => {
					if (error.response && error.response.status === 403) {
						// Handle 403 Forbidden error
						Error403(error, showToast, dispatch, Navigate);
					} else {
						console.error("Error:", error);
					}
				});
		} catch (error) {
			console.log(error);
		}
	};

	// const isPrivate = user.isPrivate

	// const isFollow = user?.following.some((u) => u._id === userdetails._id)

	const likeFunction = (_id) => {
		handleLike(id, _id, setLikeCount, setLiked, fetchLikedPost, showToast, dispatch, Navigate);
	};

	const generatePostUserFunction = (postId) => {
		console.log(postId);
		return fetchUserByPostId(postId);
	};

	const fetchUserByPostId = async (postId) => {
		console.log(postId);
		return posts
			.get(`/getusers/${postId}`)
			.then((res) => {
				if (res.data) {
					return res.data[0];
				}
			})
			.catch((error) => console.log(error));
	};

	const FollowUsers = (userId) => {
		console.log(userId);
		users
			.post("/follow-unfollow", { userId, id: userdetails._id })
			.then((res) => {
				console.log(res);
				if (res.data.status === "followed") {
					console.log("follow");
					setFollow(true);
					showUserProfile();
				} else if (res.data.status === "unfollowed") {
					console.log("unfollow");
					setFollow(false);
					showUserProfile();
				}
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

	const SendFollowRequest = (userId) => {
		users
			.post("/followrequest", { userId, id: userdetails._id })
			.then((res) => {
				console.log(res);
				if (res.data.status === "requested") {
					console.log("requested");
					setRequested(true);
					showUserProfile();
				} else if (res.data.status === "removed") {
					console.log("removed");
					setRequested(false);
					showUserProfile();
				}
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

	useEffect(() => {
		if (isCurrentUser) {
			Navigate("/profile");
		}
		showUserProfile();

		// const isFollow = user?.following.some((u) => u._id === userdetails._id)
	}, [username]);
	const [isFollowing, setisFollowing] = useState();

	const handleHover = () => {
		setisFollowing(!isFollowing);
	};
	return (
		<div className="dark:bg-black bg-white max-h-full min-h-screen">
			{/* <Heading className="text-white ml-[360px] py-2 " size={"md"}>
				{user?.name}
			</Heading> */}
			{console.log(follow)}
			<div className="flex md:w-[1110px] lg:w-[1090px] pb-16  sm:w-[980px] lg:ml-[320px] sm:ml-[55px] dark:bg-black bg-white relative">
				<div className="flex items-start justify-center  h-[450px] rounded dark:bg-black bg-white ">
					<img
						className="w-full md:w-[1100px]  sm:w-[1000px] lg:w-screen  max-h-full"
						src={
							!user?.coverpic?.url || user?.coverpic?.url === ""
								? "https://pbs.twimg.com/profile_banners/1483554293168975872/1696101628/1500x500" // Replace this with your placeholder image URL
								: user?.coverpic?.url
						}
						alt=""
					/>

					<div className="absolute top-[320px] left-[150px] transform -translate-x-1/2">
						<Avatar size={"2xl"} src={user?.propic?.url} />
					</div>
				</div>
				<div className="absolute top-[310px] left-[290px] flex flex-col items-start ">
					<div className="flex items-center space-x-10 mb-5">
						<div>
							<Text className=" dark:text-white text-black text-2xl font-bold py-1">{user?.name}</Text>
							<Link to={`/${user?.username}`}>
								<Text className=" text-gray-400 text-xl rounded-full bg-neutral-700 font-thin">
									@{user?.username}
								</Text>
							</Link>
						</div>
						{isPrivate && !follow ? (
							<button
								onClick={() => SendFollowRequest(user._id)}
								className={
									reqested
										? "text-gray-600 border border-gray-600 h-9 w-24 bg-white dark:bg-black rounded-3xl"
										: "text-green-600 border border-green-600 h-9 w-24 bg-white dark:bg-black rounded-3xl"
								}>
								{reqested ? "Requested" : "Follow"}
							</button>
						) : (
							<button
								onClick={() => FollowUsers(user._id)}
								className={
									follow
										? "text-red-600 border border-red-600 h-9 w-24 bg-white dark:bg-black rounded-3xl"
										: "text-green-600 border border-green-600 h-9 w-24 bg-white dark:bg-black rounded-3xl"
								}>
								{follow ? "Unfollow" : "Follow"}
							</button>
						)}

						{follow && (
							<button
								onClick={() => HandleMessageClick(user._id)}
								className=" dark:text-white text-black h-9 w-24 bg-zinc-700 hover:bg-zinc-800  rounded-3xl">
								Message
							</button>
						)}
						<FontAwesomeIcon
							onClick={onOptionOpen}
							className="cursor-pointer p-1 dark:text-white text-black rounded-full"
							icon={faEllipsis}
							size="2xl"
						/>
					</div>
					<div className="flex my-2">
						<Text className="text-gray-600  text-lg font-poppins hover:underline ">
							{" "}
							<span className="dark:text-white text-black">{post?.length} </span>Posts
						</Text>
						{/* Followers button */}
						<button
							onClick={() => onFollowersOpen()}
							className="text-gray-600 mx-10 text-lg font-poppins hover:underline">
							<span className="dark:text-white text-black"> {user?.followers?.length} </span> Followers
						</button>
						{/* Following button */}
						<button
							onClick={() => onFollowingOpen()}
							className="text-gray-600 text-lg font-poppins hover:underline">
							<span className="dark:text-white text-black"> {user?.following?.length} </span> Following
						</button>
					</div>
					<Text className="p-1 pt-4 dark:text-white text-black text-base ">{user?.bio}</Text>
					<FollowersModal
						userId={user._id}
						onFollowersClose={onFollowersClose}
						isFollowersOpen={isFollowersOpen}
					/>
					<FollowingModal
						userId={user._id}
						onFollowingClose={onFollowingClose}
						isFollowingOpen={isFollowingOpen}
					/>
				</div>
			</div>

			{isPrivate && !follow ? (
				<>
					<div className="ml-[380px] border border-gray-600 w-[1000px] h-60 flex justify-center items-center">
						<div className="dark:text-white text-black text-center">
							<h1>This Account is Private</h1>
							<h1 className="">Follow to see their photos and videos.</h1>
						</div>
					</div>
				</>
			) : (
				<Tabs className="ml-[320px] h-screen bg-white dark:bg-black" isFitted>
					<TabList mb="1em">
						<Tab
							className="text-lg"
							style={{
								color: activeTab === 0 ? "rgb(147, 51, 234)" : "white",
								borderBottom: activeTab === 0 ? "4px solid rgb(147, 51, 234)" : "1px solid black"
							}}
							onClick={() => setActiveTab(0)}>
							Posts
						</Tab>
						<Tab
							className="text-lg"
							style={{
								color: activeTab === 1 ? "rgb(147, 51, 234)" : "white",
								borderBottom: activeTab === 1 ? "4px solid rgb(147, 51, 234)" : "1px solid black"
							}}
							onClick={() => setActiveTab(1)}>
							Likes
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<div className="flex flex-wrap ">
								{post.map((p) => (
									<div
										onClick={onOpenPostModal}
										key={p._id} // Assuming 'postId' is a unique identifier for each p
										className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 px-2 mb-4 relative"
										onMouseEnter={() => setHoveredPostId(p._id)}
										onMouseLeave={() => setHoveredPostId(null)}>
										<img src={p?.media} alt={`p-${p._id}`} className="w-full" />
										{/* {/* Overlay for Like and Comment counts  */}
										{hoveredPostId === p._id && (
											<div className="absolute inset-0 flex items-center justify-center  dark:bg-black bg-w bg-opacity-75 dark:bg-opacity-50 text-white px-2 py-1 rounded">
												<span className="pr-8">
													{" "}
													<FontAwesomeIcon className="pr-2" icon={faHeart} />
													{p?.likes?.length}
												</span>
												<FullPost
													postId={p?._id}
													handleLike={likeFunction}
													like={like}
													isPostModalOpen={isPostModalOpen}
													onClosePostModal={onClosePostModal}
													likeCount={likeCount}
													poster={p}
													postuser={generatePostUserFunction(p?._id)}
													savepost={savepost}
													PostSave={PostSave}
												/>
												<span>
													{" "}
													<FontAwesomeIcon className="pr-2" icon={faComment} />
													{p?.comments?.length}
												</span>
											</div>
										)}
									</div>
								))}
							</div>
						</TabPanel>
						<TabPanel>
							<div className="flex flex-wrap">
								{likedPost.length > 0 &&
									likedPost.map((post) => (
										<div
											onClick={onPostModalOpen}
											key={post?._id} // Assuming 'postId' is a unique identifier for each post
											className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 px-2 mb-4 relative"
											onMouseEnter={() => setHoveredPostId(post?._id)}
											onMouseLeave={() => setHoveredPostId(null)}>
											<img src={post?.media} alt={`post-${post?._id}`} className="w-full" />
											{/* {/* Overlay for Like and Comment counts   */}
											{hoveredPostId === post?._id && (
												<div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black bg-opacity-75 text-white px-2 py-1 rounded">
													<span className="pr-8">
														{" "}
														<FontAwesomeIcon className="pr-2" icon={faHeart} />
														{post?.likes?.length}
													</span>
													<FullPost
														postId={post?._id}
														handleLike={likeFunction}
														like={like}
														isPostModalOpen={isModalPostOpen}
														onClosePostModal={onPostModalClose}
														likeCount={likeCount}
														poster={post}
														postuser={generatePostUserFunction(post?._id)}
														savepost={savepost}
														PostSave={PostSave}
													/>
													<span>
														{" "}
														<FontAwesomeIcon className="pr-2" icon={faComment} />
														{post?.comments?.length}
													</span>
												</div>
											)}
										</div>
									))}
							</div>
						</TabPanel>
					</TabPanels>
				</Tabs>
			)}
			<Modal theme={modalTheme} onClick={onOptionClose} isOpen={isOptionOpen} onClose={onOptionClose}>
				<ModalOverlay />
				<ModalContent
					style={{
						position: "absolute",
						top: "30%",
						left: "35%",
						transform: "translate(-50%, 50%)",
						backgroundColor: "#131313"
					}}>
					<>
						<button
							onClick={() => {
								onReportOpen();
								onOptionClose();
							}}
							className="hover:bg-zinc-700 dark:text-white text-black text-lg hover:rounded-xl">
							Report
						</button>
						<button
							onClick={onOptionClose}
							className="hover:bg-zinc-700 dark:text-white text-black text-lg hover:rounded-xl">
							Cancel
						</button>
					</>
				</ModalContent>
			</Modal>
			<ReportUserModal user={user} onReportClose={onReportClose} isReportOpen={isReportOpen} />
		</div>
	);
};
export default UsersProfile;
