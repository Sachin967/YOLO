import { USER_BINDING_KEY } from "../config/index.js";
import NotificationService from "../services/notification-service.js";
import { PublishMessage, SubscribeMessage } from "../utils/index.js";
import express from "express";
export const notification = (app, channel, io) => {
	const router = express.Router();
	const service = new NotificationService();
	SubscribeMessage(channel, service, io);
	router.get("/notification/:id", async (req, res, next) => {
		try {
			console.log(req.params);
			const { id } = req.params;
			const resp = await service.FetchNotification({ id });
			return res.json(resp);
		} catch (error) {}
	});

	router.post("/notification/requestconfirm", async (req, res, next) => {
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

	router.delete("/notification/requestdelete/:notId", async (req, res, next) => {
		try {
			const { notId } = req.params;
			const { status, payload } = await service.DeleteRequest({ notId });
			PublishMessage(channel, USER_BINDING_KEY, JSON.stringify(payload));
			return res.json(status);
		} catch (error) {
			console.log(error);
		}
	});
	app.use("/notification", router);
};
