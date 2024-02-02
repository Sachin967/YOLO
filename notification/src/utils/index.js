import { EXCHANGE_NAME, MESSAGE_BROKER_URL, NOTIFICATION_BINDING_KEY, QUEUE_NAME } from "../config/index.js";
import amqplib from "amqplib";

let amqplibConnection = null;
const getChannel = async () => {
	if (amqplibConnection === null) {
		amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL);
	}
	return await amqplibConnection.createChannel(); // Add await here
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

export const PublishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
		console.log("Message has been sent" + message);
	} catch (error) {
		throw error;
	}
};

// subscribe messages

// export const SubscribeMessage = async (channel, service,io) => {
// 	await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
// 	const q = await channel.assertQueue("", { exclusive: true });
// 	console.log(` Waiting for messages in queue: ${q.queue}`);

// 	channel.bindQueue(q.queue, EXCHANGE_NAME, NOTIFICATION_BINDING_KEY);
// 	channel.consume(
// 		q.queue,
// 		(msg) => {
// 			if (msg.content) {
// 				console.log("the message is:", msg.content.toString());
// 				service.SubscribeEvents(msg.content.toString(),io);
// 			}
// 			console.log("[X] received");
// 		},
// 		{
// 			noAck: true,
// 		}
// 	);
// };
export const SubscribeMessage = async (channel, service, io) => {
	const appQueue = await channel.assertQueue(QUEUE_NAME);

	channel.bindQueue(appQueue.queue, EXCHANGE_NAME, NOTIFICATION_BINDING_KEY);

	channel.consume(appQueue.queue, (data) => {
		if (data.content) {
			console.log("received data in notification");
			console.log(data.content.toString());
			service.SubscribeEvents(data.content.toString(), io);
			channel.ack(data);
		}
	});
};
