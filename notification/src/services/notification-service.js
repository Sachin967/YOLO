import { USER_BINDING_KEY } from "../config/index.js";
import NotificationRepository from "../database/repositary/notification-repositary.js";
import { PublishMessage, RPCRequest } from "../utils/index.js";

class NotificationService {
	constructor() {
		this.repository = new NotificationRepository();
	}

	async FetchNotification({ id }) {
		try {
			const notification = await this.repository.FindNotificationbyId({ id });

			const senderId = notification.map((notify) => notify.senderId);
			const response = await RPCRequest("USER_RPC", {
				type: "FETCH_USERS_BYID",
				data: senderId
			});
			return { notification, response };
		} catch (error) { }
	}

	async SubscribeEvents(payload, channel, io) {
		payload = JSON.parse(payload);
		const { event, data } = payload;
		const { recipient, senderId, notificationType, entityType, entityId, image } = data;
		switch (event) {
			case "POSTS_LIKED":
				this.repository.CreateNotification({ recipient, senderId, notificationType, entityId, entityType, image }, io);
				break;
			case "USER_FOLLOWED":
				this.repository.CreateNotification({ recipient, senderId, notificationType, entityId, entityType, image }, io);
				break;
			case "USER_UNFOLLOWED":
				this.repository.DeleteNotification({
					recipient,
					senderId,
					notificationType,
				});
				break;
			case 'POSTS_COMMENTED':
				this.repository.CreateNotification({ recipient, senderId, notificationType, entityId, entityType, image }, io);
			case "POSTS_UNLIKED":
				this.repository.DeleteNotification({
					recipient,
					senderId,
					notificationType,
				});
			default:
				break;
		}
	}
}
export default NotificationService;
