import { APP_SECRET, EXCHANGE_NAME, MESSAGE_BROKER_URL } from "../config/index.js";
import { v4 as uuid4 } from "uuid";
import amqplib from "amqplib";
import jwt from "jsonwebtoken";
export const UserisBlocked = async (req) => {
	try {
		const { userJwt } = req.cookies;
		const decoded = jwt.verify(userJwt, APP_SECRET);
		const { _id } = decoded;
		const isBlocked = await RPCRequest("USER_RPC", {
			type: "CHECK_IS_BLOCKED",
			data: _id
		});
		return isBlocked;
	} catch (error) {}
};

export const ValidateSignature = async (req) => {
	try {
		const signature = req.get("Authorization");
		const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
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

export const PublishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
		console.log("Message has been sent" + message);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
	const uuid = uuid4(); // correlationId
	return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};

export const RPCObserver = async (RPC_QUEUE_NAME, service) => {
	const channel = await getChannel();
	await channel.assertQueue(RPC_QUEUE_NAME, {
		durable: false
	});
	channel.prefetch(1);
	channel.consume(
		RPC_QUEUE_NAME,
		async (msg) => {
			if (msg.content) {
				// DB Operation
				const payload = JSON.parse(msg.content.toString());
				const response = await service.serveRPCRequest(payload);

				channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
					correlationId: msg.properties.correlationId
				});
				channel.ack(msg);
			}
		},
		{
			noAck: false
		}
	);
};
