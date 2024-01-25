import NotificationRepository from "../database/repositary/notification-repositary.js";

class NotificationService {
	constructor() {
		this.repository = new NotificationRepository();
	}

	async FetchNotification({ id }) {
		try {
			const notification = await this.repository.FindNotificationbyId({ id });
			const senderId = notification.map((notify) => notify.senderId);
			return { notification, senderId };
		} catch (error) {}
	}

	async ConfirmRequest({ noti }) {
		try {
			const payload = {
				event: "REQUEST_CONFIRMED",
				data: {
					userId: noti.recipientId,
					id: noti.senderId
				}
			};
			const resp = await this.repository.CreateNotificationAndDeleteRequest({
				id: noti._id,
				recipient: noti.recipientId,
				senderId: noti.senderId,
				notificationType: "follow",
				entityId: noti.entityId,
				entityType: noti.entityType
			});
			return { resp, payload };
		} catch (error) {
			console.log(error);
		}
	}

	async DeleteRequest({ notId }) {
		try {
			const notification = await this.repository.DeleteNotificationById({ notId });
			const payload = {
				event: "REQUEST_DELETED",
				data: {
					userId: notification.recipientId,
					id: notification.senderId
				}
			};

			return { status: "Deleted", payload };
		} catch (error) {
			console.log(error);
		}
	}

	async SubscribeEvents(payload, io) {
		payload = JSON.parse(payload);
		const { event, data } = payload;
		const { recipient, senderId, notificationType, entityType, entityId, image } = data;
		switch (event) {
			case "POSTS_LIKED":
			case "USER_FOLLOWED":
			case "FOLLOW_REQUESTED":
			case "POSTS_COMMENTED":
				this.repository.CreateNotification({ recipient, senderId, notificationType, entityId, entityType, image }, io);
				break;

			case "USER_UNFOLLOWED":
			case "FOLLOW_REMOVED":
			case "POSTS_UNLIKED":
				this.repository.DeleteNotification({ recipient, senderId, notificationType }, io);
				break;

			default:
				break;
		}
	}
}
export default NotificationService;
