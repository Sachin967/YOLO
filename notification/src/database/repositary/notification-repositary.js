import { Notification } from "../model/notificationModel.js";
class NotificationRepository {
	async CreateNotification({ recipient, senderId, notificationType, entityId, entityType, image }, io) {
		const notification = new Notification({
			recipientId: recipient,
			senderId,
			notificationType,
			entityType,
			entityID: entityId,
			Postimage: image
		});
		const savedNotification = await notification.save();

		// Emit Socket.io event for new notification to connected clients
		io.emit("newNotification", { notification: savedNotification });
	}

	async DeleteNotification({ recipient, senderId, notificationType }) {
		try {
			console.log('delete')
			const result = await Notification.deleteMany({
				recipientId: recipient,
				senderId: senderId,
				notificationType: notificationType
			});
		} catch (error) {
			console.log(error)
		}
	}

	async FindNotificationbyId({ id }) {
		try {
			const notification = await Notification.find({ recipientId: id }).sort({ createdAt: -1 });
			return notification;
		} catch (error) {}
	}
}

export default NotificationRepository;
