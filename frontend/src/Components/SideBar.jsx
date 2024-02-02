import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell, faMessage, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PostModal from "./Modals/PostModal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
	Avatar,
	useDisclosure,
	Box
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import { GoMoon } from "react-icons/go";
import { RiSettings5Line } from "react-icons/ri";
import { GoReport } from "react-icons/go";

import { useTheme } from "../Context/Themecontext";
import { handleLogout } from "../API/api";
import { CgMoreO, CgMoreR } from "react-icons/cg";
import { notifications } from "../config/axios";
import { socket } from "../config/Connectsocket";
const SideBar = ({ userinfo }) => {
	const location = useLocation();
	const { userdetails } = useSelector((state) => state.auth);
	const isHome = location.pathname.startsWith("/home");
	const isProfile = location.pathname.startsWith("/profile");
	const isNotification = location.pathname.startsWith("/notifications");
	const isMessages = location.pathname.startsWith("/messages");
	const isSearch = location.pathname.startsWith("/search");
	const isBookmark = location.pathname.endsWith("/saved");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { notify } = ChatState();
	// const [showNot, setshowNot] = useState(true);
	const [notificationCount, setNotificationCount] = useState(0);
	const { toggleTheme } = useTheme();

	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const HandleNotificationCount = async () => {
		const notification = await notifications.post("/notificationread", { recipientId: userdetails._id });
		setNotificationCount(0);
	};
	const fetchunReadNotification = () => {
		notifications
			.get(`/unreadnotification/${userdetails._id}`)
			.then((res) => {
				if (res.data) {
					setNotificationCount(res.data);
				}
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		socket.emit("suitup", userdetails);
		socket.on("connected");
		fetchunReadNotification();
	}, []);

	socket.on("newNotification", () => {
		try {
			console.log("newNotification");
			setNotificationCount(notificationCount + 1);
		} catch (error) {
			console.error("Error handling newNotification:", error);
		}
	});

	socket.on("deletedNotification", () => {
		try {
			console.log("deletedNotification");
			setNotificationCount(notificationCount - 1);
		} catch (error) {
			console.log(error);
		}
	});
	return (
		<>
			<div className="sm:hidden fixed ">
				<div className="fixed inset-0 z-40 flex">
					<div className="flex flex-col w-20 border-r border-gray-600 h-screen space-y-10 bg-white dark:bg-black ">
						{/* <button className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
							<span className="sr-only">Open sidebar</span>
							<svg
								className="w-6 h-6"
								aria-hidden="true"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									clipRule="evenodd"
									fillRule="evenodd"
									d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
							</svg>
						</button> */}
						{/* <Avatar size={'lg'} src="./yolo2.png"/> */}

						<Link to={"/home"} className="flex items-center">
							<img
								src="./yolo2.png"
								className="w-13 h-13 p-2 m-1 rounded-full  hover:bg-zinc-900"
								alt="Flowbite Logo"
							/>
						</Link>

						{/* <div className="relative"> */}
						{/* <FontAwesomeIcon className="fa-2xl p-2 text-gray-500" icon={faHouse} /> */}
						{/* </div> */}
						{/* <div className="relative"> */}
						<div className="ml-4">
							<Link to={"/profile"}>
								<FontAwesomeIcon
									className="fa-2xl p-3 hover:bg-zinc-900 rounded-full text-gray-500"
									icon={faUser}
								/>
							</Link>
						</div>
						{/* </div> */}
						{/* <div className="relative"> */}
						<div className="ml-4">
							<Link to={"/notifications"}>
								<FontAwesomeIcon
									className="fa-2xl p-3 hover:bg-zinc-900 rounded-full text-gray-500"
									icon={faBell}
								/>
							</Link>
						</div>
						{/* </div> */}
						{/* <div className="relative"> */}
						<div className="ml-4 ">
							<Link to={"/messages"}>
								<FontAwesomeIcon
									className="fa-2xl p-3 hover:bg-zinc-900 rounded-full text-gray-500"
									icon={faMessage}
								/>
							</Link>
						</div>
						{/* </div> */}
						{/* <div className="relative"> */}
						<div className="ml-4 ">
							<Link to={`/${userdetails.username}/saved`}>
								<FontAwesomeIcon
									className="fa-2xl p-3 hover:bg-zinc-900 rounded-full text-gray-500"
									icon={faBookmark}
								/>
							</Link>
						</div>
						{/* 	</div> */}
					</div>
				</div>
			</div>
			<aside
				id="logo-sidebar"
				className="fixed z-40 w-[320px] hidden sm:block h-screen transition-transform -translate-x-full sm:translate-x-0"
				aria-label="Sidebar">
				<div className="h-full border-r border-gray-700 overflow-y-auto bg-white dark:bg-black">
					<Link to={"/home"} className="flex items-center">
						<Avatar className="mx-[107px] mt-5 bg-black" size={"xl"} src="./yolo2.png" />
					</Link>
					<ul className="space-y-0 w-fit ml-3 font-medium">
						<li className="">
							<Link
								to={"/home"}
								className="flex items-center p-2 my-5  rounded-full dark:text-white text-black hover:bg-zinc-200 dark:hover:bg-gray-700 group ms-16">
								{/* <FontAwesomeIcon className="fa-xl text-white" icon={faHouse} /> */}
								<svg
									aria-label="Home"
									className="text-black dark:text-white"
									fill="currentColor"
									height="26"
									role="img"
									viewBox="0 0 24 24"
									width="26">
									<title>Home</title>
									<path
										d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
										fill="none"
										stroke="currentColor"
										strokeLinejoin="round"
										strokeWidth="2"></path>
								</svg>
								<span
									className={
										isHome
											? "mx-5 dark:text-white text-black whitespace-nowrap text-2xl font-extrabold"
											: "ms-5 dark:text-white text-black whitespace-nowrap text-2xl font-normal"
									}>
									Home
								</span>
							</Link>
						</li>
						<li className="my-6">
							<Link
								to={"/search"}
								className="flex items-center p-2 my-5 text-black rounded-full dark:text-white hover:bg-zinc-200 dark:hover:bg-gray-700 group ms-16 ">
								<svg
									aria-label="Search"
									className="dark:text-white text-black"
									fill="currentColor"
									height="24"
									role="img"
									viewBox="0 0 24 24"
									width="24">
									<title>Search</title>
									<path
										d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"></path>
									<line
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										x1="16.511"
										x2="22"
										y1="16.511"
										y2="22"></line>
								</svg>
								<span
									className={
										isSearch
											? "mx-5 dark:text-white text-black whitespace-nowrap text-2xl font-extrabold"
											: "ms-5 dark:text-white text-black whitespace-nowrap text-2xl font-normal"
									}>
									Search
								</span>
							</Link>
						</li>
						<li className="my-6">
							<Link
								to={"/profile"}
								className="flex items-center p-2 my-5 text-gray-900 rounded-full dark:text-white hover:bg-zinc-200 dark:hover:bg-gray-700 group ms-16 ">
								<FontAwesomeIcon icon={faUser} className="fa-xl dark:text-white text-black" />
								<span
									className={
										isProfile
											? "mx-5 dark:text-white text-black whitespace-nowrap text-2xl font-extrabold"
											: "ms-5 dark:text-white text-black whitespace-nowrap text-2xl font-normal"
									}>
									Profile
								</span>
							</Link>
						</li>
						<li className="my-6">
							<Link
								to={"/messages"}
								className="flex items-center p-2 my-5 text-gray-900 rounded-full dark:text-white hover:bg-zinc-200 dark:hover:bg-gray-700 group ms-16">
								{/* <FontAwesomeIcon icon={faMessage} className="fa-xl" style={{ color: "#ffffff" }} /> */}
								<svg
									aria-label="Messenger"
									className="dark:text-white text-black"
									fill="currentColor"
									height="26"
									role="img"
									viewBox="0 0 24 24"
									width="26">
									<title>Messenger</title>
									<path
										d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z"
										fill="none"
										stroke="currentColor"
										strokeMiterlimit="10"
										strokeWidth="1.739"></path>
									<path
										d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z"
										fillRule="evenodd"></path>
								</svg>
								<span
									className={
										isMessages
											? "mx-5 dark:text-white text-black whitespace-nowrap text-2xl font-extrabold"
											: "ms-5 dark:text-white text-black whitespace-nowrap text-2xl font-normal"
									}>
									Messages
								</span>
								{/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
									3
								</span> */}
							</Link>
						</li>
						<li className="my-6">
							<div onClick={HandleNotificationCount}>
								<Link
									to={"/notifications"}
									className="flex items-center p-2 my-5 text-gray-900 rounded-full dark:text-white hover:bg-zinc-200 dark:hover:bg-gray-700 group ms-16 relative">
									{/* <FontAwesomeIcon icon={faBell} className="fa-xl" style={{ color: "#ffffff" }} /> */}

									<svg
										aria-label="Notifications"
										className="dark:text-white text-black"
										fill="currentColor"
										height="26"
										role="img"
										viewBox="0 0 24 24"
										width="26">
										<title>Notifications</title>
										<path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
									</svg>
									{notificationCount > 0 && (
										<span className="inline-flex items-center justify-center w-4 h-4 p-1 bg-red-500 text-black dark:text-white text-xs font-semibold rounded-full absolute top-2 left-6">
											{notificationCount}
										</span>
									)}
									<span
										className={
											isNotification
												? "mx-5 dark:text-white text-black whitespace-nowrap text-2xl font-extrabold"
												: "ms-5 dark:text-white text-black whitespace-nowrap text-2xl font-normal"
										}>
										Notification
									</span>
									{/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
									3
								</span> */}
								</Link>
							</div>
						</li>

						<li className="my-6">
							<Link
								to={`/${userdetails.username}/saved`}
								className="flex items-center p-2 text-gray-900 rounded-full dark:text-white hover:bg-zinc-200 dark:hover:bg-gray-700 group ms-16">
								<FontAwesomeIcon icon={faBookmark} className="fa-xl dark:text-white text-black" />
								<span
									className={
										isBookmark
											? "mx-5 dark:text-white text-black whitespace-nowrap text-2xl font-extrabold"
											: " text-2xl ms-5 whitespace-nowrap dark:text-white text-black font-normal"
									}>
									Bookmarks
								</span>
							</Link>
						</li>

						<li className="my-6">
							<Popover colorScheme="gray" placement="top">
								<PopoverTrigger>
									<button
										// to={"/profile"}
										className="flex items-center p-2 my-5 text-gray-900 rounded-full dark:text-white hover:bg-zinc-200 dark:hover:bg-gray-700 group ms-16 ">
										<CgMoreO className="fa-xl dark:text-white text-black" />
										<span
											className={
												"mx-5 dark:text-white text-black whitespace-nowrap text-2xl font-normal"
											}>
											More
										</span>
									</button>
								</PopoverTrigger>
								<PopoverContent className="rounded-3xl " style={{ backgroundColor: "#2b2a2a" }}>
									{/* <PopoverArrow /> */}
									<Link
										to="/settings/change-password"
										className="text-white dark:hover:bg-zinc-700 dark:text-white">
										<div className="flex p-5">
											<RiSettings5Line className="dark:text-white text-white text-2xl mr-4" />
											Setting
										</div>
									</Link>
									<div onClick={() => toggleTheme()} className="flex p-5 hover:bg-zinc-700">
										<GoMoon className="dark:text-white text-white text-2xl mr-4" />
										<button className=" dark:text-white text-white">Switch Appearance</button>
									</div>
									<div className="flex p-5 border-b hover:bg-zinc-700">
										<GoReport className="dark:text-white text-white text-2xl mr-4" />
										<button className=" dark:text-white text-white">Report a Problem</button>
									</div>
									<button
										className="p-5 dark:text-white text-white hover:bg-zinc-700"
										onClick={() => handleLogout(dispatch, Navigate)}>
										Logout
									</button>
								</PopoverContent>
							</Popover>
						</li>
					</ul>

					<div>
						<button
							style={{ backgroundColor: "rgb(147 51 234)" }}
							className="ml-[70px] mt-10  w-44 hover:bg-purple-800 text-white font-semibold rounded-full px-6 py-[15px] text-center me-2 mb-2 "
							onClick={onOpen}>
							POST
						</button>
					</div>
				</div>
			</aside>

			<PostModal isOpen={isOpen} onClose={onClose} />
		</>
	);
};
export default SideBar;
