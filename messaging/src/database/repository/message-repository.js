import { cloudinary } from "../../config/cloudinary.js";
import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";

class MessageRepository {
	async FindChat({ userId, loggedInUserId }) {
		try {
			const chat = await Chat.find({
				isGroupChat: false,
				$and: [{ users: { $elemMatch: { $eq: loggedInUserId } } }, { users: { $elemMatch: { $eq: userId } } }]
			}).populate("latestMessage");
			return chat;
		} catch (error) {}
	}

	async UpdateMessages({ chatId, userId }) {
		console.log("hhhhhhhhhh", chatId);
		await Message.updateMany({ chatId: chatId, readBy: { $ne: userId } }, { $addToSet: { readBy: userId } });
		const updatedMessages = await Message.find({ chatId: chatId });
		console.log(updatedMessages);
		return updatedMessages;
	}

	async CreatNormalChat({ loggedInUserId, userId }) {
		try {
			const chat = await Chat.create({
				chatName: "sender",
				isGroupChat: false,
				users: [loggedInUserId, userId]
			});
			return chat;
		} catch (error) {}
	}

	async FetchAllChats(userId) {
		try {
			const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
				.populate("latestMessage")
				.sort({ updatedAt: -1 });
			console.log(chats[0]);
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
		} catch (error) {}
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
				const chat = await Chat.findByIdAndUpdate(chatId, { chatName: chatname }, { new: true });
				console.log(chat);
				return chat;
			}
		} catch (error) {
			console.log("Error:", error);
		}
	}

	async AddUser({ chatId, userIds }) {
		try {
			const chat = await Chat.findByIdAndUpdate(chatId, { $push: { users: { $each: userIds } } }, { new: true });
			return chat;
		} catch (error) {}
	}
	async RemoveUser({ chatId, userId }) {
		try {
			const chat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true });
			return chat;
		} catch (error) {}
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
		} catch (error) {}
	}

	async FindMessages(chatId) {
		try {
			console.log("chatId", chatId);
			const chat = await Chat.findOne({ _id: chatId });
			const message = await Message.find({ chatId: chatId }).populate("chatId");

			return { message, chat };
		} catch (error) {}
	}
	async FindGroupChat(id) {
		try {
			const chats = await Chat.find({ isGroupChat: true });
			const userChats = chats.filter((chat) => chat.users.includes(id));
			return userChats;
		} catch (error) {
			console.error(error);
			throw error; // Rethrow the error if you want to propagate it
		}
	}
}
export default MessageRepository;
