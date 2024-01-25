import { APP_SECRET, EXCHANGE_NAME, MESSAGE_BROKER_URL } from "../config/index.js";
import amqplib from "amqplib";
import jwt from "jsonwebtoken";

export const ValidateSignature = async (req) => {
	try {
		console.log(req.cookies);
		const accessToken = req.cookies.userJwt;
		const payload = await jwt.verify(accessToken, APP_SECRET);
		req.user = payload;
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

let amqplibConnection = null;
const getChannel = async () => {
	if (amqplibConnection === null) {
		amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL);
	}
	return await amqplibConnection.createChannel();
};

export const createChannel = async () => {
	try {
		const channel = await getChannel();
		await channel.assertExchange(EXCHANGE_NAME, "direct", false);
		return channel;
	} catch (error) {
		throw error;
	}
};

export const SubscribeMessage = async (channel, service) => {
	const appQueue = await channel.assertQueue(QUEUE_NAME);

	channel.bindQueue(appQueue.queue, EXCHANGE_NAME, POST_BINDING_KEY);

	channel.consume(appQueue.queue, (data) => {
		if (data.content) {
			console.log("received data in Shopping");
			service.SubscribeEvents(data.content.toString());
			channel.ack(data);
		}
	});
};

export const PublishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
		console.log("Message has been sent" + message);
	} catch (error) {
		console.log(error);
		throw error;
	}
};
