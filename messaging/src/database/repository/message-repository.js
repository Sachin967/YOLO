import { cloudinary } from "../../config/cloudinary.js";
import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";

class MessageRepository {
	async FindChat({ id, userId }) {
		try {
			const chat = await Chat.find({
				isGroupChat: false,
				$and: [{ users: { $elemMatch: { $eq: id } } }, { users: { $elemMatch: { $eq: userId } } }]
			}).populate("latestMessage");
			return chat;
		} catch (error) { }
	}

	async CreatNormalChat({ id, userId }) {
		try {
			const chat = await Chat.create({
				chatName: "sender",
				isGroupChat: false,
				users: [id, userId]
			});
			return chat;
		} catch (error) { }
	}

	async FetchAllChats(userId) {
		try {
			const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
				.populate("latestMessage")
				.sort({ updatedAt: -1 });
			return chats;
		} catch (error) {
			console.log(error);
		}
	}

	async CreateGroup({ users, chatName, curruser }) {
		try {
			const groupChat = await Chat.create({
				chatName,
				users,
				isGroupChat: true,
				groupAdminId: curruser
			});
			return groupChat;
		} catch (error) { }
	}

	async ModifyChatName({ chatId, chatname, groupimage }) {
		try {
			if (groupimage) {
				const result = await cloudinary.uploader.upload(groupimage, {
					folder: "group"
				});
				const chat = await Chat.findByIdAndUpdate(
					chatId,
					{
						chatName: chatname,
						groupImage: {
							public_id: result.public_id,
							url: result.secure_url
						}
					},
					{ new: true }
				);
				return chat;
			} else {
				const chat = await Chat.findByIdAndUpdate(
					chatId,
					{ chatName: chatname },
					{ new: true }
				);
				console.log(chat);
				return chat;
			}
		} catch (error) {
			console.log("Error:", error);
		}
	}


	async AddUser({ chatId, userIds }) {
		try {
			const chat = await Chat.findByIdAndUpdate(
				chatId,
				{ $push: { users: { $each: userIds } } },
				{ new: true }
			);
			return chat;
		} catch (error) { }
	}
	async RemoveUser({ chatId, userId }) {
		try {
			const chat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true });
			return chat;
		} catch (error) { }
	}

	async CreateMessage({ content, chatId, userId }) {
		try {
			const message = await Message.create({
				senderId: userId,
				content: content,
				chatId: chatId
			});
			const populatedMessage = await Message.findById(message._id).populate("chatId");

			const chatToUpdate = await Chat.findById(chatId);

			if (!chatToUpdate.latestMessage || message) {
				chatToUpdate.latestMessage = populatedMessage._id;
				await chatToUpdate.save();
			}

			return { populatedMessage, chatToUpdate };
		} catch (error) { }
	}

	async FindMessages(chatId) {
		try {
			console.log("chatId", chatId);
			const message = await Message.find({ chatId: chatId }).populate("chatId");
			console.log("message", message);
			return message;
		} catch (error) { }
	}
	async FindGroupChat(id) {
		try {
			const chats = await Chat.find({ isGroupChat: true });
			const chatsWithOtherUsers = chats.reduce((result, chat) => {
				if (chat.users.includes(id)) {
					const otherUsers = chat.users.filter((userId) => userId !== id);
					result.push({ chat, otherUsers });
				}
				return result;
			}, []);

			return chatsWithOtherUsers;
		} catch (error) { }
	}
}
export default MessageRepository;
