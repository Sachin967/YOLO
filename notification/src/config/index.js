import dotEnv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
	const configFile = `./.env.${process.env.NODE_ENV}`;
	dotEnv.config({ path: configFile });
} else {
	dotEnv.config();
}
const EXCHANGE_NAME = "YOLO-MEDIA";
const QUEUE_NAME = "NOTIFICATION_QUEUE";
const POST_BINDING_KEY = "POSTS_SERVICE";
const NOTIFICATION_BINDING_KEY = "NOTIFICATION_SERVICE";
const USER_BINDING_KEY = "USER-SERVICE";
const { PORT, MONGODB_URL, APP_SECRET, MESSAGE_BROKER_URL } = process.env;

export {
	PORT,
	MONGODB_URL,
	APP_SECRET,
	EXCHANGE_NAME,
	QUEUE_NAME,
	POST_BINDING_KEY,
	MESSAGE_BROKER_URL,
	NOTIFICATION_BINDING_KEY,
	USER_BINDING_KEY
};
