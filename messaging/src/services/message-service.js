import MessageRepository from "../database/repository/message-repository.js";
import { RPCRequest } from "../utils/index.js";

class MessageService {
	constructor() {
		this.repository = new MessageRepository();
	}

	async AccessChat({ userId, loggedInUserId }) {
		try {
			const chats = await this.repository.FindChat({ userId, loggedInUserId });
			const response = await RPCRequest("USER_RPC", {
				type: "FETCH_USERS",
				data: { userId, loggedInUserId }
			});

			if (chats.length > 0) {
				const chatData = chats[0];

				return { chatData, response };
			} else {
				const createChat = await this.repository.CreatNormalChat({ loggedInUserId, userId });

				const response = await RPCRequest("USER_RPC", {
					type: "FETCH_USERS",
					data: { userId, loggedInUserId }
				});
				const chatData = createChat;
				return { chatData, response };
			}
		} catch (error) {
			console.log(error);
		}
	}

	async FetchChats(userId) {
		try {
			const chats = await this.repository.FetchAllChats(userId);
			const userIds = chats.map((chat) => chat.users).flat();
			const filteredUserIds = userIds.filter((id) => id !== userId);
			const response = await RPCRequest("USER_RPC", {
				type: "FETCH_USERS",
				data: filteredUserIds
			});
			const res = await RPCRequest("USER_RPC", {
				type: "FETCH_USERS",
				data: chats.groupAdminId
			});
			if (chats.length > 0) {
				const chatData = chats;
				return { chatData, users: response, admin: res };
			}
		} catch (error) {
			console.log(error);
		}
	}

	async CreateGroupChat({ users, chatName }, req) {
		try {
			const curruser = req.user._id;
			users.push(curruser);
			const createdGroupchat = await this.repository.CreateGroup({ users, chatName, curruser });
			const UserIds = createdGroupchat.users
				.map((userid) => {
					return userid;
				})
				.flat();
			const response = await RPCRequest("USER_RPC", {
				type: "FETCH_USERS",
				data: UserIds
			});
			return { createdGroupchat, response };
		} catch (error) {}
	}

	async RenameChat({ chatId, chatname, groupimage }) {
		try {
			const renamedchat = await this.repository.ModifyChatName({ chatId, chatname, groupimage });
			// const UserIds = renamedchat
			// 	.map((chat) => {
			// 		return chat.users;
			// 	})
			// 	.flat();
			// const response = await RPCRequest("USER_RPC", {
			// 	type: "FETCH_USERS",
			// 	data: UserIds
			// });
			// const res = await RPCRequest("USER_RPC", {
			// 	type: "FETCH_USERS",
			// 	data: renamedchat.groupAdminId
			// });
			return renamedchat;
		} catch (error) {}
	}

	async AddUsertoGroup({ chatId, userIds }) {
		try {
			const adduser = await this.repository.AddUser({ chatId, userIds });
			// const UserIds = adduser
			// 	.map((chat) => {
			// 		return chat.users;
			// 	})
			// 	.flat();
			// const response = await RPCRequest("USER_RPC", {
			// 	type: "FETCH_USERS",
			// 	data: UserIds
			// });
			// const res = await RPCRequest("USER_RPC", {
			// 	type: "FETCH_USERS",
			// 	data: adduser.groupAdminId
			// });
			return adduser;
		} catch (error) {}
	}

	async RemoveFromGroup({ chatId, userId }) {
		try {
			const removeuser = await this.repository.RemoveUser({ chatId, userId });
			// const UserIds = removeuser
			// 	.map((chat) => {
			// 		return chat.users;
			// 	})
			// 	.flat();
			// const response = await RPCRequest("USER_RPC", {
			// 	type: "FETCH_USERS",
			// 	data: UserIds
			// });
			// const res = await RPCRequest("USER_RPC", {
			// 	type: "FETCH_USERS",
			// 	data: removeuser.groupAdminId
			// });
			return { removeuser };
		} catch (error) {}
	}

	async SendMessage({ content, chatId, userId }) {
		try {
			const { populatedMessage, chatToUpdate } = await this.repository.CreateMessage({ content, chatId, userId });
			const response = await RPCRequest("USER_RPC", {
				type: "FETCH_USERS",
				data: chatToUpdate.users
			});
			return { populatedMessage, response };
		} catch (error) {}
	}

	async FetchMessages({ userId, chatId }) {
		try {
			const {message,chat} = await this.repository.FindMessages(chatId);
			const user = chat?.users;
			console.log("oooo", userId);
			console.log("UUU", user);
			const response = await RPCRequest("USER_RPC", {
				type: "FETCH_USERS",
				data: user
			});
			// console.log("========="+response);
			return { message, response };
		} catch (error) {}
	}
	async FetchGroupChats(id) {
		try {
			const groupChat = await this.repository.FindGroupChat(id);
			for (const chatData of groupChat) {
				const { otherUsers, chat } = chatData;
				// Perform RPC call for each set of other users in the array
				const result = await RPCRequest("USER_RPC", {
					type: "FETCH_USERS",
					data: otherUsers
				});

				return { result, chat };
			}
		} catch (error) {}
	}
}

export default MessageService;
