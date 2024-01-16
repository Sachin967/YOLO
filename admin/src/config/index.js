import dotEnv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}
const { PORT, MONGODB_URL, APP_SECRET, MESSAGE_BROKER_URL } = process.env;

const EXCHANGE_NAME = "YOLO-MEDIA";
const USER_BINDING_KEY = "USER-SERVICE";
const ADMIN_BINDING_KEY = "ADMIN-SERVICE";
const QUEUE_NAME = "ADMIN_QUEUE";
export {
  PORT,
  MONGODB_URL,
  APP_SECRET,
  EXCHANGE_NAME,
  MESSAGE_BROKER_URL,
  USER_BINDING_KEY,
  ADMIN_BINDING_KEY,
  QUEUE_NAME,
};
