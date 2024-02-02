import { Notification } from "../model/notificationModel.js";
class NotificationRepository {
	async CreateNotification({ recipient, senderId, notificationType, entityId, entityType, image }, io) {
		try {
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
			if (io) {
				console.log('send')
				io.to(recipient).emit("newNotification");
			}
		} catch (error) {
			console.log(error);
		}
	}

	async CreateNotificationAndDeleteRequest({ recipient, senderId, notificationType, entityId, entityType, id }) {
		try {
			const notification = new Notification({
				recipientId: recipient,
				senderId,
				notificationType,
				entityId,
				entityType
			});
			const noti = await notification.save();
			await Notification.findByIdAndDelete(id);
			return { status: "success", noti };
		} catch (error) {
			console.log(error);
		}
	}

	async DeleteNotificationById({ notId }) {
		try {
			return await Notification.findByIdAndDelete(notId);
		} catch (error) {
			console.log(error);
		}
	}

	async DeleteNotification({ recipient, senderId, notificationType }, io) {
		try {
			console.log("delete");
			const result = await Notification.deleteMany({
				recipientId: recipient,
				senderId: senderId,
				notificationType: notificationType
			});
			io.to(recipient).emit("deletedNotification");
		} catch (error) {
			console.log(error);
		}
	}

	async FindNotificationbyId({ id }) {
		try {
			const notification = await Notification.find({ recipientId: id }).sort({ createdAt: -1 });
			return notification;
		} catch (error) {}
	}

	async SetReadTrue(recipientId) {
		try {
			const isRead = await Notification.updateMany({ recipientId }, { $set: { isRead: true } });
			return true;
		} catch (error) {
			console.log(error);
		}
	}

	async CountUnreadNotification(userId) {
		const count = await Notification.find({ recipientId: userId, isRead: false }).countDocuments();
		return count;
	}
}

export default NotificationRepository;
