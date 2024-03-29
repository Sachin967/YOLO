import { Avatar, Button, Heading, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { faEllipsis, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { posts, users } from "../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import EditProfileDrawer from "../Components/Modals/EditProfileDrawer";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddCoverPicModal from "../Components/AddCoverPicModal";
import useCustomToast from "../config/toast";
import FollowersModal from "../Components/Modals/FollowersModal";
import FollowingModal from "../Components/Modals/FollowingModal";
import FullPost from "../Components/FullPost";
import { SavePost, fetchLikedPost, fetchSavedPost, handleLike } from "../API/api";
import { ChatState } from "../Context/ChatProvider";
import { debounce } from "lodash";
const Profile = () => {
	const { userdetails } = useSelector((state) => state.auth);
	const id = userdetails._id;
	const Navigate = useNavigate();
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const [user, setUser] = useState({});
	const [Posts, setPosts] = useState([]);
	const [likedPost, setLikedPost] = useState({});
	const [hoveredPostId, setHoveredPostId] = useState(null);
	const debouncedSetHoveredPostId = debounce(setHoveredPostId, 100); // Adjust the delay as needed
	const [activeTab, setActiveTab] = useState(0);
	const [isCoverPic, setCoverPic] = useState(false);
	const { isOpen: isFollowingOpen, onOpen: onFollowingOpen, onClose: onFollowingClose } = useDisclosure();
	const { isOpen: isFollowersOpen, onOpen: onFollowersOpen, onClose: onFollowersClose } = useDisclosure();
	// const [openModal, setOpenModal] = useState(false);
	const { isOpen: isPostModalOpen, onOpen: onOpenPostModal, onClose: onClosePostModal } = useDisclosure();
	const { isOpen: isModalPostOpen, onOpen: onPostModalOpen, onClose: onPostModalClose } = useDisclosure();
	const [savepost, setSavePost] = useState(false);
	const [likeCount, setLikeCount] = useState();
	const [like, setLiked] = useState(false);
	const { savedpost, setSavedPost } = ChatState();
	const [userData, setUserdata] = useState([]);
	// const handleHover = () => {
	// 	setisFollowing(!isFollowing);
	// };

	const likeFunction = (_id) => {
		handleLike(id, _id, setLikeCount, setLiked, fetchLikedPost, showToast, dispatch, Navigate);
	};
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isCoverPicOpen, onOpen: onCoverPicOpen, onClose: onCoverPicClose } = useDisclosure();
	const showUserProfile = async () => {
		try {
			const user = await users.get(`/profile/${userdetails.username}`);
			if (user.data) {
				const post = await posts.get(`/likedAndUserPosts/${user.data._id}`);
				setPosts(post?.data?.likedposts);
				setLikedPost(post?.data?.posts);
				setUser(user.data);
			}
		} catch (error) {
			if (error.response && error.response.status === 403) {
				// Handle 403 Forbidden error
				Error403(error, showToast, dispatch, Navigate);
			} else {
				console.error("Error:", error);
			}
		}
	};

	const HandleClick = (type) => {
		try {
			if (type === "cover") {
				setCoverPic(true);
			} else if (type === "pro") {
				setCoverPic(false);
			}
			onCoverPicOpen();
		} catch (error) {}
	};

	useEffect(() => {
		showUserProfile();
		fetchUserByPostId(id);
	}, []);

	const PostSave = async (postId) => {
		try {
			const fetchedPosts = await SavePost({ postId, id });
			setSavePost(fetchedPosts);
			fetchSavedPost(setSavedPost, id);
		} catch (error) {
			console.log(error);
		}
	};

	const generatePostUserFunction = (postId) => {
		return fetchUserByPostId(postId);
	};

	const fetchUserByPostId = async (postId) => {
		const user = posts.get(`/getusers/${postId}`);
		const userId = user?.data;
		if (userId) {
			return await users.get(`/getuser/${userId}`);
		}
	};
	return (
		<>
			<div className="dark:bg-black bg-white max-h-full min-h-screen">
				<div className=" md:w-[1110px] lg:w-[1090px]   sm:w-[980px] lg:ml-[320px] sm:ml-[55px] bg-white dark:bg-black relative">
					<div className=" rounded dark:bg-black bg-white ">
						<div className="bg-white">
							<img
								onClick={() => HandleClick("cover")}
								className="w-full object-cover md:w-[1100px] sm:w-[1000px] lg:w-screen h-[300px]"
								src={
									!user?.coverpic?.url || user?.coverpic?.url === ""
										? "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
										: user?.coverpic?.url
								}
								alt="Click to add images"
							/>
						</div>
					</div>

					<div className="flex items-center space-y-5">
						<div className="flex items-center">
							<div className="p-8">
								<Avatar onClick={() => HandleClick("pro")} size={"2xl"} src={user?.propic?.url} />
							</div>
							<div>
								<Text className="dark:text-white text-black text-2xl font-bold py-1">{user?.name}</Text>
								<Link to={`/${user?.username}`}>
									{" "}
									<Text className="text-gray-500 text-lg w-auto rounded-full hover:bg-neutral-700 font-thin">
										@{user?.username}
									</Text>
								</Link>
								<div className="flex">
									<button
										onClick={() => onFollowersOpen()}
										className="text-gray-500 my-3 text-lg me-10 font-poppins hover:underline">
										<span className="dark:text-white text-black">{user?.followers?.length}</span>{" "}
										Followers
									</button>
									{/* Following button */}
									<button
										onClick={() => onFollowingOpen()}
										className="text-gray-500 text-lg font-poppins hover:underline">
										<span className="dark:text-white text-black">{user?.following?.length}</span>{" "}
										Following
									</button>
								</div>
								<Text className="text-xl  mt-5 dark:text-white text-black font-thin">{user?.bio}</Text>
							</div>
						</div>
						<div className="ml-[400px]">
							<button
								className="text-white h-9 w-24 bg-zinc-700 hover:bg-zinc-800 rounded-3xl"
								onClick={onOpen}>
								Edit Profile
							</button>
						</div>
					</div>
				</div>
				<FollowersModal
					userId={userdetails._id}
					onFollowersClose={onFollowersClose}
					isFollowersOpen={isFollowersOpen}
				/>
				<FollowingModal
					userId={userdetails._id}
					onFollowingClose={onFollowingClose}
					isFollowingOpen={isFollowingOpen}
				/>
				<Tabs className="ml-[320px] mt-8 bg-white dark:bg-black h-auto" isFitted>
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
								{likedPost.length > 0 &&
									likedPost.map((post) => (
										<div
											onClick={onPostModalOpen}
											key={post?._id} // Assuming 'postId' is a unique identifier for each post
											className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 px-2 mb-4 relative"
											onMouseEnter={() => setHoveredPostId(post?._id)}
											onMouseLeave={() => setHoveredPostId(null)}>
											<img src={post?.media} alt={`post-${post?._id}`} className="w-full" />
											{/* {/* Overlay for Like and Comment counts  */}
											{hoveredPostId === post?._id && (
												<div className="absolute inset-0 flex items-center justify-center  dark:bg-black bg-opacity-30 dark:bg-opacity-30 text-white px-2 py-1 rounded">
													<span className="pr-8 dark:text-white text-black">
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
													<span className="dark:text-white text-black">
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
						<TabPanel>
							<div className="flex flex-wrap ">
								{Posts.map((post) => (
									<div
										onClick={onOpenPostModal}
										key={post._id} // Assuming 'postId' is a unique identifier for each post
										className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 px-2 mb-4 relative"
										onMouseEnter={() => debouncedSetHoveredPostId(post._id)}
										onMouseLeave={() => setHoveredPostId(null)}>
										<img src={post?.media} alt={`post-${post._id}`} className="w-full" />
										{/* Overlay for Like and Comment counts */}
										{hoveredPostId === post._id && (
											<div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black bg-opacity-30 dark:bg-opacity-30 text-white px-2 py-1 rounded">
												<span className="pr-8 dark:text-white text-black">
													{" "}
													<FontAwesomeIcon className="pr-2" icon={faHeart} />
													{post?.likes?.length}
												</span>
												<FullPost
													postId={post?._id}
													handleLike={likeFunction}
													like={like}
													isPostModalOpen={isPostModalOpen}
													onClosePostModal={onClosePostModal}
													likeCount={likeCount}
													poster={post}
													postuser={userdetails}
													savepost={savepost}
													PostSave={PostSave}
												/>
												<span className="dark:text-white text-black">
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
				<EditProfileDrawer showUserProfile={showUserProfile} user={user} isOpen={isOpen} onClose={onClose} />
				<AddCoverPicModal
					showUserProfile={showUserProfile}
					isOpen={isCoverPicOpen}
					username={userdetails.username}
					onClose={onCoverPicClose}
					isCoverPic={isCoverPic}
				/>
			</div>
		</>
	);
};
export default Profile;
