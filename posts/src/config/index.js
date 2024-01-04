import dotEnv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
	const configFile = `./.env.${process.env.NODE_ENV}`;
	dotEnv.config({ path: configFile });
} else {
	dotEnv.config();
}

const { PORT, MONGODB_URL, APP_SECRET, MESSAGE_BROKER_URL } = process.env;
const EXCHANGE_NAME = "YOLO-MEDIA";
const QUEUE_NAME = "POSTS_QUEUE";
const POST_BINDING_KEY = "POSTS_SERVICE";
const USER_BINDING_KEY = "USER_SERVICE";
const NOTIFICATION_BINDING_KEY = "NOTIFICATION_SERVICE";

export {
	PORT,
	MONGODB_URL,
	USER_BINDING_KEY,
	APP_SECRET,
	EXCHANGE_NAME,
	QUEUE_NAME,
	POST_BINDING_KEY,
	MESSAGE_BROKER_URL,
	NOTIFICATION_BINDING_KEY
};
