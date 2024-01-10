import { Avatar, useDisclosure } from "@chakra-ui/react";
import { faCommentAlt, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, lazy, Suspense } from "react";
import { notifications, posts, users } from "../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
// import FullPost from "../Components/FullPost";
const FullPost = lazy(() => import("../Components/FullPost"));
import { SavePost, fetchLikedPost, fetchSavedPost, handleLike } from "../API/api";
import useCustomToast from "../toast";

const Notification = () => {
	const [like, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState();
	const { userdetails } = useSelector((state) => state.auth);
	const id = userdetails._id;
	const { notify, setNotify, setSavedPost } = ChatState();
	const { isOpen: isPostModalOpen, onOpen: onOpenPostModal, onClose: onClosePostModal } = useDisclosure();
	const [savepost, setSavePost] = useState(false);
	const Navigate = useNavigate();
	const showToast = useCustomToast();
	const [loading, setLoading] = useState(true);
	const [post, setPost] = useState([]);
	const [user, setUser] = useState([]);
	const dispatch = useDispatch();
	useEffect(() => {
		ShowNotifications();
	}, []);

	const handleImageClick = (postId) => {
		fetchPostDetail(postId);
		if (user.length > 0) {
			onOpenPostModal();
		}
	};

	const fetchPostDetail = (postId) => {
		posts
			.post("/postdetails", { postId })
			.then((res) => {
				if (res.data.status) {
					console.log(res.data);
					setPost(res.data.response);
					console.log(res.data.response);
					setUser(res.data.user);
				}
			})
			.catch((error) => console.log(error));
	};

	const ShowNotifications = () => {
		notifications
			.get(`/notification/${userdetails._id}`)
			.then((res) => {
				setLoading(false);
				if (res.data) {
					const { notification, response } = res.data;
					const notificationWithUser = notification.map((notify) => {
						const userDetail = response.find((user) => user._id === notify.senderId);
						return { ...notify, userDetail };
					});
					setNotify(notificationWithUser);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const likeFunction = (_id) => {
		handleLike(id, _id, setLikeCount, setLiked, fetchLikedPost, showToast, dispatch, Navigate);
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
	const timeAgo = (timestamp) => {
		const currentTime = new Date();
		const notificationTime = new Date(timestamp);
		const difference = currentTime.getTime() - notificationTime.getTime();
		const seconds = Math.floor(difference / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours >= 24) {
			return notificationTime.toLocaleDateString(); // Display full date if more than 24 hours
		} else if (hours >= 1) {
			return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else if (minutes >= 1) {
			return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else {
			return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
		}
	};
	const today = new Date();
	const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	const todayNotifications = [];
	const earlierNotifications = [];

	notify.forEach((notification) => {
		const notificationDate = new Date(notification.createdAt);

		if (notificationDate >= todayStart) {
			todayNotifications.push(notification);
		} else {
			earlierNotifications.push(notification);
		}
	});

	const renderNotification = (not) => {
		return (
			<>
				<div className="flex p-5 sm:w-full w-auto items-center border-b border-gray-700" key={not._id}>
					{not?.notificationType === "like" && (
						<>
							<FontAwesomeIcon
								className="sm:text-4xl text-2xl sm:me-10 me-2"
								icon={faHeart}
								style={{ color: "#ff3040" }}
							/>
							<Link to={`/${not?.userDetail?.username}`}>
								<Avatar size={"md"} className="me-3" src={not?.userDetail?.propic?.url} />
							</Link>
							<Link to={`/${not?.userDetail?.username}`}>
								{" "}
								<h2 className="sm:text-lg text-sm sm:me-5 me-2 text-white cursor-pointer">
									<span className="text-blue-400 me-3">@{not?.userDetail?.username}</span> just liked
									your post
								</h2>
							</Link>
							<img
								onClick={() => handleImageClick(not?.entityID)}
								className="cursor-pointer w-12 h-12 mr-2 sm:mr-5"
								src={not?.Postimage}
								alt=""
							/>
							{post.post && (
								<Suspense fallback={<div>Loading...</div>}>
									{" "}
									<FullPost
										postId={not?.entityID}
										handleLike={likeFunction}
										like={like}
										onClosePostModal={onClosePostModal}
										isPostModalOpen={isPostModalOpen}
										likeCount={likeCount}
										poster={post.post}
										postuser={user[0]}
										savepost={savepost}
										PostSave={PostSave}
									/>
								</Suspense>
							)}
						</>
					)}
					{not?.notificationType === "follow" && (
						<>
							<FontAwesomeIcon className="text-4xl me-10" icon={faUser} style={{ color: "#1d9bf0" }} />
							<Link to={`/${not?.userDetail?.username}`}>
								{" "}
								<Avatar size={"md"} className="me-3" src={not?.userDetail?.propic?.url} />
							</Link>
							<Link to={`/${not?.userDetail?.username}`}>
								{" "}
								<h2 className="text-lg me-5 text-white">
									<span className="text-blue-400 me-3">@{not?.userDetail?.username}</span>
									started following you
								</h2>
							</Link>
						</>
					)}
					{not?.notificationType === "comment" && (
						<>
							<FontAwesomeIcon
								className="text-4xl me-10"
								icon={faCommentAlt}
								style={{ color: "#1d9bf0" }}
							/>
							<Link to={`/${not?.userDetail?.username}`}>
								{" "}
								<Avatar size={"md"} className="me-5" src={not?.userDetail?.propic?.url} />
							</Link>
							<Link to={`/${not?.userDetail?.username}`}>
								{" "}
								<h2 className="text-lg me-5 text-white">
									<span className="text-blue-400 me-3">@{not?.userDetail?.username}</span>
									commented on your post
								</h2>
							</Link>
							<img className="w-12 mr-5" src={not?.Postimage} alt="" />

							{post.post && (
								<Suspense fallback={<div>Loading...</div>}>
									<FullPost
										postId={not?.entityID}
										handleLike={likeFunction}
										like={like}
										onClosePostModal={onClosePostModal}
										isPostModalOpen={isPostModalOpen}
										likeCount={likeCount}
										poster={post.post}
										postuser={user[0]}
										savepost={savepost}
										PostSave={PostSave}
									/>
								</Suspense>
							)}
						</>
					)}

					<p className="text-sm text-gray-300">{timeAgo(not.createdAt)}</p>
				</div>
			</>
		);
	};
	return (
		<>
			<div className="flex h-full">
				<div className="ml-20 w-[694px] md:w-[1110px] lg:w-[750px] min-h-screen max-h-full sm:w-[980px] lg:ml-[320px] sm:ml-[55px] bg-black">
					<div className="p-4  max-w-[750px] ">
						<h2 className="text-center font-poppins text-2xl text-white">Notifications</h2>
						<br />
						{loading && (
							<div role="status" className="relative">
								<svg
									aria-hidden="true"
									className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 absolute top-60 left-80"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
								<span class="sr-only">Loading...</span>
							</div>
						)}
						{!loading && notify.length < 1 && (
							<>
								<div className="flex justify-center h-full mt-60 font-poppins ">
									<h1 className="text-white text-3xl">No Notifications to show</h1>
								</div>
							</>
						)}
						{todayNotifications.length > 0 && (
							<>
								<p className="text-lg text-white">Today</p>
								{todayNotifications.map(
									(not) => renderNotification(not) // Function to render individual notification
								)}
							</>
						)}
						{todayNotifications.length === 0 && earlierNotifications.length > 0 && (
							<>
								<p className="text-lg text-white">Earlier</p>
								{earlierNotifications.map(
									(not) => renderNotification(not) // Function to render individual notification
								)}
							</>
						)}
					</div>
				</div>
				<div className="sm:block hidden w-[370px] border-l border-gray-700 bg-black"></div>
			</div>
		</>
	);
};
export default Notification;
