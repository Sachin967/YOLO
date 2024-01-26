import { USER_BINDING_KEY } from "../config/index.js";
import NotificationService from "../services/notification-service.js";
import { PublishMessage, SubscribeMessage } from "../utils/index.js";
import express from "express";
import { Server } from "socket.io";
export const notification = (app, channel, server) => {
	const router = express.Router();
	const service = new NotificationService();
	const io = new Server(server, {
		pingTimeout: 60000,
		cors: {
			origin: ["*"],
			// methods: ["GET", "POST"],
			// allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true // If you're using cookies or authorization headers
		}
	});
	const notificationNamespace = io.of("/notification");
	notificationNamespace.on("connection", (socket) => {
		console.log("connected to notification namespace");
		socket.on("suitup", (userData) => {
			socket.join(userData._id);
			socket.emit("connected");
		});
	});
	// io.on("connection", (socket) => {
	// 	console.log("connected to socket.io");
	// 	socket.on("suitup", (userData) => {
	// 		socket.join(userData._id);
	// 		socket.emit("connected");
	// 	});
	// });
	SubscribeMessage(channel, service, io);
	router.get("/:id", async (req, res, next) => {
		try {
			console.log(req.params);
			const { id } = req.params;
			const resp = await service.FetchNotification({ id });
			return res.json(resp);
		} catch (error) {}
	});

	router.post("/requestconfirm", async (req, res, next) => {
		try {
			const { noti } = req.body;
			console.log(noti);
			const { resp, payload } = await service.ConfirmRequest({ noti });
			PublishMessage(channel, USER_BINDING_KEY, JSON.stringify(payload));
			return res.json(resp);
		} catch (error) {
			console.log(error);
		}
	});

	router.delete("/requestdelete/:notId", async (req, res, next) => {
		try {
			const { notId } = req.params;
			const { status, payload } = await service.DeleteRequest({ notId });
			PublishMessage(channel, USER_BINDING_KEY, JSON.stringify(payload));
			return res.json(status);
		} catch (error) {
			console.log(error);
		}
	});

	router.post("/notificationread", async (req, res) => {
		try {
			const { recipientId } = req.body;
			const isRead = await service.repository.SetReadTrue(recipientId);
			return res.json(isRead);
		} catch (error) {}
	});

	router.get("/unreadnotification/:userId", async (req, res) => {
		try {
			const { userId } = req.params;
			const count = await service.repository.CountUnreadNotification(userId);
			return res.json(count);
		} catch (error) {}
	});
	app.use("/notification", router);
};
