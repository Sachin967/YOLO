import React, { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const [selectedChat, setselectedChat] = useState([]);
	const [user, setUser] = useState();
	const [notification, setNotification] = useState([]);
	const [chats, setChats] = useState();
	const [people, setpeople] = useState([]);
	const [chatdata, setChatData] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState();
	const [notify, setNotify] = useState([]);
	const [savedpost, setSavedPost] = useState([]);
		const [updatedName, setUpdatedName] = useState(null);
		const [updatedImage, setUpdatedImage] = useState();
	return (
		<ChatContext.Provider
			value={{
				notify,
				setNotify,
				selectedUsers,
				setSelectedUsers,
				chatdata,
				setChatData,
				selectedChat,
				setselectedChat,
				user,
				setUser,
				notification,
				setNotification,
				chats,
				setChats,
				people,
				setpeople,
				savedpost,
				setSavedPost,
				updatedName,
				setUpdatedName,
				updatedImage,
				setUpdatedImage
			}}>
			{children}
		</ChatContext.Provider>
	);
};

export const ChatState = () => {
	return useContext(ChatContext);
};

export default ChatProvider;
