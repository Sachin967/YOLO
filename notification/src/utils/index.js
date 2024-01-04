import { v4 as uuid4 } from "uuid";
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
export const SubscribeMessage = async (channel, service,io) => {
	const appQueue = await channel.assertQueue(QUEUE_NAME);

	channel.bindQueue(appQueue.queue, EXCHANGE_NAME, NOTIFICATION_BINDING_KEY);

	channel.consume(appQueue.queue, (data) => {
		if (data.content) {
			console.log("received data in posts");
			console.log(data.content.toString());
			service.SubscribeEvents(data.content.toString(), channel,io);
			channel.ack(data);
		}
	});
};

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
	try {
		const channel = await getChannel();

		const q = await channel.assertQueue("", { exclusive: true });

		channel.sendToQueue(RPC_QUEUE_NAME, Buffer.from(JSON.stringify(requestPayload)), {
			replyTo: q.queue,
			correlationId: uuid
		});

		return new Promise((resolve, reject) => {
			// timeout n
			const timeout = setTimeout(() => {
				channel.close();
				resolve("API could not fullfil the request!");
			}, 8000);
			channel.consume(
				q.queue,
				(msg) => {
					if (msg.properties.correlationId == uuid) {
						resolve(JSON.parse(msg.content.toString()));
						clearTimeout(timeout);
					} else {
						reject("data Not found!");
					}
				},
				{
					noAck: true
				}
			);
		});
	} catch (error) {
		console.log(error);
		return "error";
	}
};

export const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
	const uuid = uuid4(); // correlationId
	return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};
