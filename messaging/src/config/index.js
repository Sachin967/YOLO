import dotenv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
	const configFile = `./.env.${process.env.NODE_ENV}`;
	dotenv.config({ path: configFile });
} else {
	dotenv.config();
}
const EXCHANGE_NAME = "YOLO-MEDIA";
const QUEUE_NAME = "MESSAGE_QUEUE";
const USER_BINDING_KEY = "USER_SERVICE";
const NOTIFICATION_BINDING_KEY = "NOTIFICATION_SERVICE";
const { PORT, MONGODB_URL, APP_SECRET, MESSAGE_BROKER_URL } = process.env;

export {MESSAGE_BROKER_URL, PORT, MONGODB_URL, APP_SECRET, NOTIFICATION_BINDING_KEY, USER_BINDING_KEY, QUEUE_NAME, EXCHANGE_NAME };
