import NotificationService from "../services/notification-service.js";
import { SubscribeMessage } from "../utils/index.js";

export const notification = (app, channel,io) => {
	const service = new NotificationService();
	SubscribeMessage(channel, service,io);
	app.get("/notification/:id", async (req, res, next) => {
		try {
			console.log(req.params)
			const { id } = req.params;
			const resp= await service.FetchNotification({id})
			return res.json(resp)
		} catch (error) {}
	});
};
