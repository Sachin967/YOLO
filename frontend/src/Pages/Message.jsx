import { useState } from "react";
import Chat from "../Components/Chat";
import MyChats from "../Components/MyChats";
import { ChatState } from "../Context/ChatProvider";
import { messaging } from "../config/axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Message = () => {
	const { userId } = useParams();
	const { peopleMessaged, setPeopleMessaged, fetchAgain, setFetchAgain } = ChatState();
	const { people, setpeople } = ChatState();
	const { userdetails } = useSelector((state) => state.auth);
	const FetchChats = () => {
		try {
			messaging
				.get(`/fetchchat/${userdetails._id}`)
				.then((res) => {
					console.log(res);
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
				userId={userId}
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
