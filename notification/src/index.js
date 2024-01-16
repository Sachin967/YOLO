import express from "express";
import { dBConnection } from "./database/index.js";
import expressApp from "./expressApp.js";
import { PORT } from "./config/index.js";
import { createChannel } from "./utils/index.js";
import { Server } from "socket.io";
const StartServer = async () => {
	const app = express();
	await dBConnection();
	const channel = await createChannel();
	const server = app
		.listen(PORT, () => console.log(`Notifications is running on >>>${PORT}`))
		.on("error", (err) => {
			console.log(err);
			process.exit(1);
		});
	const io = new Server(server, {
		pingTimeout: 60000,
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true // If you're using cookies or authorization headers
		}
	});
	io.on("connection", (socket) => {
		console.log("connected to socket.io");
		socket.on("suitup", (userData) => {
			socket.join(userData._id);
			socket.emit("connected");
		});
	});
	await expressApp(app, channel, io);
};
StartServer();
