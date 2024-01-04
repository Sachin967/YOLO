import { useState } from "react";
import Chat from "../Components/Chat";
import MyChats from "../Components/MyChats";
import { ChatState } from "../Context/ChatProvider";
import { messaging } from "../config/axios";
import { useSelector } from "react-redux";

const Message = () => {
	const [fetchAgain, setFetchAgain] = useState(false);
	const [peopleMessaged, setPeopleMessaged] = useState([]);
	const { people, setpeople } = ChatState();
	const {userdetails}= useSelector((state)=>state.auth)
	const FetchChats = () => {
		try {
			messaging
				.get(`/fetchchat/${userdetails._id}`)
				.then((res) => {
					setPeopleMessaged(res.data.chatData);
					setpeople(res.data.users);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="flex">
			<MyChats
				people={people}
				setpeople={setpeople}
				peopleMessaged={peopleMessaged}
				setPeopleMessaged={setPeopleMessaged}
				fetchAgain={fetchAgain}
				FetchChats={FetchChats}
			/>
			<Chat FetchChats={FetchChats} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
		</div>
	);
};
export default Message;
