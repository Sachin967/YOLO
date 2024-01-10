import MessageService from "../services/message-service.js";
import { UserAuth } from "./middleware/auth.js";

export const message = (app) => {
	const service = new MessageService();
	app.get("/fetchchat/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const chats = await service.FetchChats(id);
			return res.json(chats);
		} catch (error) { }
	});
	app.post("/accesschat",UserAuth, async (req, res, next) => {
		try {
			const { userId } = req.body;
			const loggedInUserId = req.user._id
			const chat = await service.AccessChat({ userId, loggedInUserId });
			return res.json(chat);
		} catch (error) { }
	});
	app.post("/group", UserAuth, async (req, res, next) => {
		try {
			const users = JSON.parse(req.body.users);
			const chatName = req.body.name;
			if (users.length < 2) {
				return res.status(400).json({ message: "More than two members are required to form a group chat" });
			}
			const groupchat = await service.CreateGroupChat({ users, chatName }, req);
			return res.json(groupchat);
		} catch (error) { }
	});
	app.put("/renamegroup/:chatId", async (req, res, next) => {
		try {
			console.log(req.params)
			const { chatId } = req.params
			const { groupimage, chatname } = req.body;
			const renamedchat = await service.RenameChat({ chatId, chatname, groupimage });
			return res.json(renamedchat);
		} catch (error) { }
	});
	app.put("/groupadd", async (req, res, next) => {
		try {
			const users = JSON.parse(req.body.users);
			console.log(users)
			const userIds = users.map((u)=> u._id)
			console.log(userIds)
			const { chatId } = req.body;
			const addtogroup = await service.AddUsertoGroup({ chatId, userIds });
			return res.json(addtogroup);
		} catch (error) { }
	});
	app.put("/groupremove", async (req, res, next) => {
		try {
			const { chatId, userId } = req.body;
			const response = await service.RemoveFromGroup({ chatId, userId });
			return res.json(response);
		} catch (error) { }
	});

	app.post("/message", UserAuth, async (req, res, next) => {
		try {

			const { content, chatId } = req.body;
			const userId = req.user._id;

			const savemessage = await service.SendMessage({ content, chatId, userId });
			res.json(savemessage);
		} catch (error) { }
	});
	app.get("/message/:chatId", UserAuth, async (req, res, next) => {
		try {
			const userId = req.user._id;
			const { chatId } = req.params;
			const getAllmessages = await service.FetchMessages({ chatId, userId });
			return res.json(getAllmessages);
		} catch (error) { }
	});
	app.get("/searchchat/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const getChats = await service.FetchGroupChats(id);
			return res.json(getChats);
		} catch (error) {

		}
	});
};
