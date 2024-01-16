import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SECRET, EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME, GMAIL, PASS, USER_BINDING_KEY } from "../config/index.js";
import { v4 as uuid4 } from "uuid";
import nodemailer from "nodemailer";
import amqplib from "amqplib";

export const GenerateSalt = async () => {
	return await bcrypt.genSalt();
};

export const GeneratePassword = async (password, salt) => {
	return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (enteredPassword, salt, savedPassword) => {
	return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (res, payload) => {
	try {
		const token = await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
		// Set the JWT token as a cookie
		res.cookie("userJwt", token, {
			httpOnly: false,
			secure: process.env.NODE_ENV !== "dev",
			sameSite: "Strict",
			maxAge: 30 * 24 * 60 * 60 * 1000
		});

		return token;
	} catch (error) {
		console.log(error);
		return error;
	}
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

export const FormateData = async (data) => {
	if (data) {
		return { data };
	} else {
		throw new Error("Data Not found!");
	}
};

export function generateUsername(name) {
	// Extracting the first letter of the first name
	const firstInitial = name.toLowerCase();
	// Generating a random number (between 1000 and 9999) to make the username unique
	const randomNumber = Math.floor(Math.random() * 9000) + 1000;
	// Combining the first initial, last name, and random number to create the username
	const username = `${firstInitial}${randomNumber}`;

	return username;
}

export function generateOTP() {
	const digits = "0123456789";
	let OTP = "";
	for (let i = 0; i < 6; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
}

export const sendOTP = (email, otp) => {
	return new Promise((resolve, reject) => {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL,
				pass: PASS
			}
		});
		let mailOptions = {
			from: "your-email@gmail.com",
			to: email,
			subject: "Your OTP for Verification",
			text: `Your OTP is: ${otp}`
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error.message);
				reject(error);
			} else {
				console.log("Email sent: " + info.response);
				resolve(info.response);
			}
		});
	});
};
let amqplibConnection = null;
const getChannel = async () => {
	if (amqplibConnection === null) {
		amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL);
	}
	return await amqplibConnection.createChannel();
};

export const CreateChannel = async () => {
	try {
		const channel = await getChannel();
		await channel.assertExchange(EXCHANGE_NAME, "direct", false);
		return channel;
	} catch (error) {
		throw error;
	}
};

// publish messages
export const PublishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
		console.log("Message has been sent" + message);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// subscribe messages
export const SubscribeMessage = async (channel, service) => {
	const appQueue = await channel.assertQueue(QUEUE_NAME);

	channel.bindQueue(appQueue.queue, EXCHANGE_NAME, USER_BINDING_KEY);

	channel.consume(appQueue.queue, (data) => {
		if (data.content) {
			console.log("received data in Users");
			console.log(data.content.toString());
			service.SubscribeEvents(data.content.toString(), channel);
			channel.ack(data);
		}
	});
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
			// console.log("Received message:", msg);
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
