import { useEffect, useState } from "react";
import Chat from "../Components/Chat";
import MyChats from "../Components/MyChats";
import { ChatState } from "../Context/ChatProvider";
import { messaging, users } from "../config/axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Message = () => {
	const { userId } = useParams();
	const { peopleMessaged, setPeopleMessaged, fetchAgain, setFetchAgain } = ChatState();
	const { people, setpeople } = ChatState();
	const { userdetails } = useSelector((state) => state.auth);
	const FetchChats = async () => {
		try {
			const chat = await messaging.get(`/fetchchat/${userdetails._id}`);
			if (chat.data) {
				console.log(chat.data);
				setPeopleMessaged(chat.data);
				await fetchAndSetPeople(chat.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const fetchAndSetPeople = async (chats) => {
		if (chats.length > 0) {
			const userIds = chats.map((chat) => chat.users).flat();
			const filteredUserIds = userIds.filter((id) => id !== userId);
			if (filteredUserIds.length > 0) {
				const str = filteredUserIds.join(",");
				try {
					const usrs = await users.get(`/getusers/${str}`);
					if (usrs.data) {
						setpeople(usrs.data);
					}
				} catch (error) {
					console.log(error);
				}
			}
		}
	};
	useEffect(() => {
		FetchChats();
	}, [fetchAgain, userdetails._id]);
	return (
		<div className="flex">
			<MyChats
				userId={userId}
				people={people}
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
