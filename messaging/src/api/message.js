import MessageService from "../services/message-service.js";
import { UserAuth } from "./middleware/auth.js";
import express from "express";
import { Server } from "socket.io";
export const message = (app, server) => {
	const router = express.Router();
	const service = new MessageService();
	const io = new Server(server, {
		pingTimeout: 60000,
		cors: {
			origin: ["http://localhost:4000", "https://yolomedia.sachinms.fyi"]
			// credentials: true,
		}
	});

	const messagingNamespace = io.of("/messaging");
	messagingNamespace.on("connection", (socket) => {
		console.log("Connected to messaging namespace");

		socket.on("setup", (userData) => {
			socket.join(userData._id);
			socket.emit("connected");
		});

		socket.on("join chat", (room) => {
			socket.join(room);
			console.log("User joined room:" + room);
		});

		socket.on("typing", (room) => socket.in(room).emit("typing"));
		socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

		socket.on("new message", (newMessageReceived) => {
			var chat = newMessageReceived.chatId;
			if (!chat.users) return console.log("chat.users not defined");
			chat.users.forEach((user) => {
				if (user == newMessageReceived.senderId) return;
				socket.in(user).emit("message received", newMessageReceived);
			});
		});

		socket.on("disconnect", () => {
			console.log("User disconnected from messaging namespace");
		});
	});

	// io.on("connection", (socket) => {
	// 	console.log("connected to socket.io");
	// 	socket.on("setup", (userData) => {
	// 		socket.join(userData._id);
	// 		socket.emit("connected");
	// 	});
	// 	socket.on("join chat", (room) => {
	// 		socket.join(room);
	// 		console.log("user joined room:" + room);
	// 	});
	// 	socket.on("typing", (room) => socket.in(room).emit("typing"));
	// 	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
	// 	socket.on("new message", (newMessageReceived) => {
	// 		var chat = newMessageReceived.chatId;
	// 		if (!chat.users) return console.log("chat.users not defined");
	// 		chat.users.forEach((user) => {
	// 			if (user == newMessageReceived.senderId) return;
	// 			socket.in(user).emit("message received", newMessageReceived);
	// 		});
	// 	});
	// 	socket.off("setup", () => {
	// 		console.log("USER DISCONNECTED");
	// 		socket.leave(userData._id);
	// 	});
	// });
	router.get("/fetchchat/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const chats = await service.FetchChats(id);
			return res.json(chats);
		} catch (error) {}
	});
	router.post("/accesschat", UserAuth, async (req, res, next) => {
		try {
			const { userId } = req.body;
			const loggedInUserId = req.user._id;
			const chat = await service.AccessChat({ userId, loggedInUserId });
			return res.json(chat);
		} catch (error) {}
	});
	router.post("/group", UserAuth, async (req, res, next) => {
		try {
			const users = JSON.parse(req.body.users);
			const chatName = req.body.name;
			if (users.length < 2) {
				return res.status(400).json({ message: "More than two members are required to form a group chat" });
			}
			const groupchat = await service.CreateGroupChat({ users, chatName }, req);
			return res.json(groupchat);
		} catch (error) {}
	});
	router.put("/renamegroup/:chatId", async (req, res, next) => {
		try {
			console.log(req.params);
			const { chatId } = req.params;
			const { groupimage, chatname } = req.body;
			const renamedchat = await service.RenameChat({ chatId, chatname, groupimage });
			return res.json(renamedchat);
		} catch (error) {}
	});
	router.put("/groupadd", async (req, res, next) => {
		try {
			const users = JSON.parse(req.body.users);
			console.log(users);
			const userIds = users.map((u) => u._id);
			console.log(userIds);
			const { chatId } = req.body;
			const addtogroup = await service.AddUsertoGroup({ chatId, userIds });
			return res.json(addtogroup);
		} catch (error) {}
	});
	router.put("/groupremove", async (req, res, next) => {
		try {
			const { chatId, userId } = req.body;
			const response = await service.RemoveFromGroup({ chatId, userId });
			return res.json(response);
		} catch (error) {}
	});

	router.post("/message", UserAuth, async (req, res, next) => {
		try {
			const { content, chatId } = req.body;
			console.log(req.body);
			const userId = req.user._id;
			const savemessage = await service.SendMessage({ content, chatId, userId });
			res.json(savemessage);
		} catch (error) {}
	});
	router.get("/message/:chatId", UserAuth, async (req, res, next) => {
		try {
			const userId = req.user._id;
			const { chatId } = req.params;
			const getAllmessages = await service.FetchMessages({ chatId, userId });
			return res.json(getAllmessages);
		} catch (error) {}
	});
	router.get("/searchchat/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const getChats = await service.FetchGroupChats(id);
			return res.json(getChats);
		} catch (error) {}
	});

	router.post("/readmessage/:chatId", UserAuth, async (req, res, next) => {
		try {
			const { chatId } = req.params;
			const userId = req.user._id;
			const updateMessage = await service.repository.UpdateMessages({ chatId, userId });
			return res.json(updateMessage);
		} catch (error) {}
	});
	app.use("/messaging", router);
};
