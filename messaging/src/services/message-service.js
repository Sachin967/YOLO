import MessageRepository from "../database/repository/message-repository.js";
import { RPCRequest } from "../utils/index.js";

class MessageService {
	constructor() {
		this.repository = new MessageRepository();
	}

	async AccessChat({ userId, loggedInUserId }) {
		try {
			const chats = await this.repository.FindChat({ userId, loggedInUserId });
			if (chats.length > 0) {
				const chatData = chats[0];
				return { chatData };
			} else {
				const chatData = await this.repository.CreatNormalChat({ loggedInUserId, userId });
				return { chatData };
			}
		} catch (error) {
			console.log(error);
		}
	}

	async FetchChats(userId) {
		try {
			const chats = await this.repository.FetchAllChats(userId);
			if (chats.length > 0) {
				const chatData = chats;
				return chatData;
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
			if (createdGroupchat) {
				return { status: true };
			}
		} catch (error) {}
	}

	async RenameChat({ chatId, chatname, groupimage }) {
		try {
			const renamedchat = await this.repository.ModifyChatName({ chatId, chatname, groupimage });
			return renamedchat;
		} catch (error) {}
	}

	async AddUsertoGroup({ chatId, userIds }) {
		try {
			const adduser = await this.repository.AddUser({ chatId, userIds });
			return adduser;
		} catch (error) {}
	}

	async RemoveFromGroup({ chatId, userId }) {
		try {
			const removeuser = await this.repository.RemoveUser({ chatId, userId });
			return { removeuser };
		} catch (error) {}
	}

	async SendMessage({ content, chatId, userId }) {
		try {
			const { populatedMessage, chatToUpdate } = await this.repository.CreateMessage({ content, chatId, userId });
			return { populatedMessage, chatToUpdate };
		} catch (error) {}
	}

	async FetchMessages({ userId, chatId }) {
		try {
			const { message, chat } = await this.repository.FindMessages(chatId);
			const user = chat?.users;
			return { message, user };
		} catch (error) {}
	}
	async FetchGroupChats(id) {
		try {
			const groupChats = await this.repository.FindGroupChat(id);
			return groupChats;
		} catch (error) {
			console.error(error);
			throw error; // Rethrow the error if you want to propagate it
		}
	}
}

export default MessageService;
