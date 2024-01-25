import { useEffect, useState } from "react";
import { users } from "../config/axios";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { MdClear } from "react-icons/md";
import Suggesions from "../Components/Suggesions";
import { useSelector } from "react-redux";
import { NotFollowers } from "../API/api";
const Search = () => {
	const [search, setSearch] = useState("");
	const { recentSearches, setRecentSearches, notfollowers, setNotfollowers } = ChatState();
	const { userdetails } = useSelector((state) => state.auth);
	const [user, setUser] = useState([]);
	const Navigate = useNavigate();
	const handleInputChange = (e) => {
		setSearch(e.target.value);
		if (e.target.value === "") {
			// Show recent searches when the input is empty
			setRecentSearches([...recentSearches]);
		} else {
			fetchAllUsers();
		}
	};
	const handleUserClick = (u) => {
		const isAlreadyInRecentSearches = recentSearches.some((user) => user._id === u._id);
		// Add clicked user to recent searches
		if (!isAlreadyInRecentSearches) {
			setRecentSearches([u, ...recentSearches]);
		}
		setUser([]);
		// Navigate to user profile
		Navigate(`/${u?.username}`);
	};
	const fetchAllUsers = () => {
		users
			.get(`/users/${search}`)
			.then((res) => {
				if (res.data) {
					setUser(res.data);
				}
			})
			.catch((error) => console.log(error));
	};
	const RemoveUser = (e, u) => {
		e.stopPropagation();
		const updatedsearch = recentSearches.filter((user) => user._id !== u._id);
		setRecentSearches(updatedsearch);
	};

	useEffect(() => {
		NotFollowers(userdetails._id, setNotfollowers);
	}, []);

	return (
		<div className="h-screen flex">
			<div className="ml-20 w-[694px] relative md:w-[1110px] lg:w-[750px] min-h-screen max-h-full sm:w-[980px] lg:ml-[320px] sm:ml-[55px] bg-white dark:bg-black">
				<div className="w-full border-b border-gray-700">
					<h1 className="dark:text-white text-black font-bold text-2xl px-7 py-3">Search</h1>
					<input
						value={search}
						onChange={handleInputChange}
						style={{ backgroundColor: "#363434" }}
						type="text"
						className="w-[700px] rounded-3xl pl-12 h-[52px] focus:outline-none focus:border-purple-500 mb-8 text-black dark:text-white mx-6  mt-3 placeholder-white" // Adjusted padding
						placeholder="Search"
					/>
					<svg
						aria-label="Search"
						className="dark:text-white text-black absolute top-20 left-[35px]"
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
				</div>
				{recentSearches.length > 0 && (
					<div className="flex">
						<h1 className="p-4 pl-7 text-lg font-semibold dark:text-white text-black">Recent</h1>
						<div className="ml-auto">
							<h1
								onClick={() => {
									setUser([]);
									setRecentSearches([]);
								}}
								className="text-base cursor-pointer font-semibold text-blue-700 pr-5 mt-5">
								Clear All
							</h1>
						</div>
					</div>
				)}
				<div>
					{user &&
						user.map((u) => (
							<div
								key={u?._id}
								onClick={() => handleUserClick(u)}
								className="flex items-center space-x-4 mx-5 mt-3 pb-2 hover:bg-zinc-800">
								<Avatar className="pl-3" src={u?.propic?.url}></Avatar>
								<div className="flex-1">
									<h1 className="text-lg dark:text-white text-black font-semibold">{u?.name}</h1>
									<h1 className="text-gray-500">{u?.username}</h1>
								</div>
							</div>
						))}
					{user?.length === 0 && search !== "" && (
						<div className="flex h-[400px] items-center justify-center">
							<h1 className="text-gray-400 font-semibold">No matching results</h1>
						</div>
					)}
					{user?.length === 0 && search === "" && (
						<>
							{recentSearches.length == 0 && (
								<div className="flex items-center justify-center mt-5">
									<h1 className="text-gray-400 font-semibold">No Recent Searches</h1>
								</div>
							)}
							<div>
								{recentSearches.map((recentUser) => (
									<>
										<div
											key={recentUser?._id}
											onClick={() => handleUserClick(recentUser)}
											className="flex items-center space-x-4 mx-5 pb-2 hover:bg-zinc-800 cursor-pointer">
											<Avatar className="" src={recentUser?.propic?.url}></Avatar>
											<div className="flex-1">
												<h1 className="text-lg dark:text-white text-black font-semibold">
													{recentUser?.name}
												</h1>
												<h1 className="text-gray-500">{recentUser?.username}</h1>
											</div>
											<button
												onClick={(e) => RemoveUser(e, recentUser)}
												className="cursor-alias dark:text-white text-black text-2xl pe-5">
												<MdClear />
											</button>
										</div>
									</>
								))}
							</div>
						</>
					)}{" "}
				</div>
			</div>
			<Suggesions notfollowers={notfollowers} />
		</div>
	);
};
export default Search;
