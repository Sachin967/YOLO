import { Avatar } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { NotFollowers, handleLogout } from "../API/api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";

const Suggesions = ({}) => {
	const { notfollowers, setNotfollowers } = ChatState();
	const { userdetails } = useSelector((state) => state.auth);
	useEffect(() => {
		NotFollowers(userdetails._id, setNotfollowers);
	}, []);
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	return (
		<div className="sm:block hidden w-[370px] border-l  border-gray-700 bg-white dark:bg-black">
			<div className="flex mt-5 ml-3 p-2">
				<Avatar src={userdetails?.propic?.url}></Avatar>
				<div className="flex flex-col w-full ms-4 ">
					<h1 className="dark:text-white font-semibold  text-black">{userdetails?.name}</h1>
					<h1 className="dark:text-gray-400 text-gray-700">{userdetails?.username}</h1>
				</div>
				<button onClick={() => handleLogout(dispatch, Navigate)} className="mr-3 text-red-600 text-sm">
					Logout
				</button>
			</div>
			<div className="mt-5">
				<h1 className="ms-4 my-3 font-bold text-base text-black dark:text-white">Suggested for you</h1>
				{notfollowers.map((user) => {
					return (
						<div key={user._id} className="flex  ml-3 p-2">
							<Link to={`/${user?.username}`}>
								{" "}
								<Avatar src={user?.propic?.url}></Avatar>
							</Link>
							<div className="flex flex-col  ms-4 text-sm">
								<Link to={`/${user?.username}`}>
									<h1 className="dark:text-white  font-semibold  text-black">{user?.name}</h1>{" "}
								</Link>
								<Link to={`/${user?.username}`}>
									{" "}
									<h1 className="dark:text-gray-400 text-gray-700">{user?.username}</h1>
								</Link>
							</div>
							<button className="ml-auto mr-3 justify-end text-purple-600 text-sm">Follow</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default Suggesions;
