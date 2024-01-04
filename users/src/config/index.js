import dotEnv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
	const configFile = `./.env.${process.env.NODE_ENV}`;
	dotEnv.config({ path: configFile });
} else {
	dotEnv.config();
}
const NOTIFICATION_BINDING_KEY = "NOTIFICATION_SERVICE";
const QUEUE_NAME = "USER_QUEUE";
const EXCHANGE_NAME = "YOLO-MEDIA";
const POST_BINDING_KEY = "POSTS_SERVICE";
const ADMIN_BINDING_KEY = "ADMIN-SERVICE";
const USER_BINDING_KEY = "USER-SERVICE";
const { PORT, MONGODB_URL, APP_SECRET, GMAIL, PASS, MESSAGE_BROKER_URL } = process.env;
export {
	PORT,
	MONGODB_URL,
	APP_SECRET,
	GMAIL,
	PASS,
	MESSAGE_BROKER_URL,
	EXCHANGE_NAME,
	POST_BINDING_KEY,
	ADMIN_BINDING_KEY,
	QUEUE_NAME,
	NOTIFICATION_BINDING_KEY,
	USER_BINDING_KEY
};
