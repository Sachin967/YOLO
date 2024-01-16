import { Avatar, useDisclosure } from "@chakra-ui/react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { messaging, users } from "../config/axios";
import { useSelector } from "react-redux";
import GroupChatModal from "./Modals/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
const MyChats = ({ userId, fetchAgain, people, setpeople, peopleMessaged, setPeopleMessaged, FetchChats }) => {
	const [search, setSearch] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [follow, setFollow] = useState([]);
	const [chat, setChat] = useState([]);
	const { userdetails } = useSelector((state) => state.auth);
	// const [peopleMessaged, setPeopleMessaged] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { selectedUsers, setSelectedUsers, chatdata, setChatData, updatedName, updatedImage } = ChatState();
	const [selectedChatId, setSelectedChatId] = useState(null);
	const handleChatSelection = (chat) => {
		setSelectedChatId(chat._id === selectedChatId ? null : chat._id);
	};
	useEffect(() => {
		if (userId) {
			AccessChats(userId);
		}
		SearchUsers();
		FetchChats();
		searchGroupChat();
	}, [fetchAgain]);

	const AccessChats = (userId) => {
		try {
			messaging
				.post("/accesschat", { userId })
				.then((res) => {
					if (res.data) {
						setSelectedUsers(res.data.chatData);
						setChatData(res.data.response);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {}
	};
	const handleAccessChat = (chat) => {
		if (!chat.isGroupChat) {
			const loggedInUserId = userdetails._id;
			const User = chat.users.find((user) => user !== loggedInUserId);
			if (User) {
				AccessChats(User);
			} else {
				console.log("No user ID found in the chat");
			}
		}
	};
	const SearchUsers = () => {
		users
			.get(`/searchuser/${userdetails._id}`)
			.then((res) => {
				if (res.data) {
					setFollow(res.data);
				}
			})
			.catch((err) => console.log(err));
	};

	const searchGroupChat = () => {
		messaging
			.get(`/searchchat/${userdetails._id}`)
			.then((res) => {
				if (res.data) {
					setChat(res.data.chat);
				}
			})
			.catch((err) => console.log(err));
	};
	const filteredFollowers = follow.followers || [];
	const filteredFollowing = follow.following || [];

	const filteredUsersSet = new Set();
	const combinedUsers = filteredFollowers.concat(filteredFollowing).concat(chat);

	const uniqueUsers = combinedUsers.filter((user) => {
		if (user && user._id && !filteredUsersSet.has(user._id)) {
			filteredUsersSet.add(user._id);
			return true;
		}
		return false;
	});

	const filteredUsers = uniqueUsers.filter((user) => {
		const hasChatName = user?.chatName && user.chatName.toLowerCase().includes(search.toLowerCase());
		const hasName = user?.name && user.name.toLowerCase().includes(search.toLowerCase());
		const hasUsername = user?.username && user.username.toLowerCase().includes(search.toLowerCase());

		return hasChatName || hasName || hasUsername;
	});

	const renderChatDetails = (chat) => {
		const isSelected = chat._id === selectedChatId;
		if (chat.isGroupChat) {
			return (
				<>
					<div
						onClick={() => handleChatSelection(chat)}
						className={`flex w-full ${isSelected ? "dark:bg-neutral-800 bg-zinc-400" : ""}`}
						key={chat._id}>
						<Avatar className="m-5" src={updatedImage || chat?.groupImage?.url} />
						<h2 className="mt-5 me-2 text-lg dark:text-white text-black font-bold">{updatedName || chat?.chatName}</h2>
					</div>

					{/* <h2 className="mt-5 me-2 text-xl">@{chat?.username}</h2> */}
				</>
			);
		} else {
			const otherUser = people.find((user) => chat.users.includes(user._id) && user._id !== userdetails._id);
			if (otherUser) {
				return (
					<>
						<div
							onClick={() => handleChatSelection(chat)}
							className={`flex w-full ${isSelected ? "dark:bg-neutral-800 bg-zinc-400" : ""}`}
							key={chat._id}>
							<Avatar className="m-5" src={otherUser?.propic?.url} />
							<h2 className="mt-5 me-2 text-lg dark:text-white text-black font-bold">{otherUser?.name}</h2>
							<h2 className="mt-5 me-2 text-lg text-gray-400 font-normal">@{otherUser?.username}</h2>
						</div>
					</>
				);
			}
		}
		return null;
	};

	const combinedComponents =
		follow.followers &&
		filteredUsers
			.map((user) => {
				if (user?.isGroupChat) {
					return (
						<div key={user._id} className="flex mt-3 hover:bg-zinc-300 dark:hover:bg-neutral-900">
							<Avatar className="m-5" src={user?.propic?.url} />
							<h2 className="mt-5 me-2 text-xl dark:text-white text-black font-bold">{user?.chatName}</h2>
							{/* <h2 className="mt-5 me-2 text-xl">@{user?.username}</h2> */}
						</div>
					);
				} else {
					return (
						<div
							key={user._id}
							className="flex mt-3 hover:bg-zinc-300 dark:hover:bg-neutral-900"
							onClick={() => AccessChats(user._id)}>
							<Avatar className="m-5" src={user?.propic?.url} />
							<h2 className="mt-5 me-2 text-xl dark:text-white text-black font-bold">{user?.name}</h2>
							<h2 className="mt-5 me-2 text-xl">@{user?.username}</h2>
						</div>
					);
				}
			})
			.concat(
				peopleMessaged?.map((chat) => (
					<React.Fragment key={chat?._id}>
						<div
							onClick={() => {
								setSelectedUsers(chat);
								handleAccessChat(chat);
							}}
							className="flex hover:bg-zinc-300 dark:hover:bg-neutral-900">
							{renderChatDetails(chat)}
						</div>
					</React.Fragment>
				))
			);
	return (
		<div
			className={
				setSelectedUsers
					? "hidden lg:block lg:ml-[320px] overflow-y-auto dark:bg-black bg-white max-h-screen"
					: " w-[694px] md:w-[1110px] lg:w-[450px]  min-h-screen sm:w-[980px] lg:ml-[320px] sm:ml-[105px] dark:bg-black bg-white overflow-y-auto max-h-screen"
			}>
			<div className="flex sm:ml-[270px] lg:ml-0  justify-between items-center">
				<h2 className="text-2xl text-black dark:text-white font-bold p-3">Messages</h2>
				<svg
					onClick={onOpen}
					className="me-5 dark:text-white text-black cursor-pointer"
					aria-label="Create new Group"
					fill="currentColor"
					height="26"
					role="img"
					viewBox="0 0 24 24"
					width="26">
					<title>Create new group</title>
					<path
						d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952"
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"></path>
					<path
						d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z"
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"></path>
					<line
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						x1="16.848"
						x2="20.076"
						y1="3.924"
						y2="7.153"></line>
				</svg>
			</div>
			<div className="relative sm:ml-[270px] lg:ml-0">
				<input
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
					}}
					onClick={(e) => setShowSearch(true)}
					type="text"
					placeholder="Search"
					className="w-[410px] h-14 bg-transparent ms-5 mt-5 text-black dark:text-white pl-14 rounded-full"
					style={{ paddingRight: "2rem" }}
				/>
				<FontAwesomeIcon
					icon={faMagnifyingGlass}
					className="absolute top-12 left-10 transform -translate-y-1/2 text-black dark:text-white"
				/>
			</div>
			<GroupChatModal FetchChats={FetchChats} filteredUsers={filteredUsers} isOpen={isOpen} onClose={onClose} />
			{showSearch ? (
				<div className="mt-3 sm:ml-[270px] lg:ml-0">
					{search === "" ? (
						<>
							<div className="mt-5">
								{peopleMessaged?.map((chat) => (
									<React.Fragment key={chat?._id}>
										<div
											onClick={() => {
												setSelectedUsers(chat);
												handleAccessChat(chat);
											}}
											className="flex hover:bg-zinc-300 dark:hover:bg-neutral-900">
											{renderChatDetails(chat)}
										</div>
									</React.Fragment>
								))}
							</div>
						</>
					) : (
						<>{combinedComponents}</>
					)}
				</div>
			) : (
				<div className="mt-5 sm:ml-[270px]  lg:ml-0">
					{peopleMessaged?.map((chat) => (
						<React.Fragment key={chat?._id}>
							<div
								onClick={() => {
									setSelectedUsers(chat);
									handleAccessChat(chat);
								}}
								className="flex hover:bg-zinc-300 dark:hover:bg-neutral-900">
								{renderChatDetails(chat)}
							</div>
						</React.Fragment>
					))}
				</div>
			)}
		</div>
	);
};
export default MyChats;
