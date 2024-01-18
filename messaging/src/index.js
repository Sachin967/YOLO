import express from "express";
import { dBConnection } from "./database/index.js";
import { PORT } from "./config/index.js";
import expressApp from "./express-app.js";
import { Server } from "socket.io";
const StartServer = async () => {
	const app = express();
	await dBConnection();
	await expressApp(app);

	const server = app
		.listen(PORT, () => console.log(`Messaging running on ${PORT}`))
		.on("error", (err) => {
			console.log(err);
			process.exit(1);
		});
	const io = new Server(server, {
		pingTimeout: 60000,
		cors: {
			origin: ["http://localhost:3000", "https://yolo.d45nr5kvsoeec.amplifyapp.com"]
			// credentials: true,
		}
	});
	io.on("connection", (socket) => {
		console.log("connected to socket.io");
		socket.on("setup", (userData) => {
			socket.join(userData._id);
			socket.emit("connected");
		});
		socket.on("join chat", (room) => {
			socket.join(room);
			console.log("user joined room:" + room);
		});
		socket.on("typing", (room) => socket.in(room).emit("typing"));
		socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
		socket.on("new message", (newMessageReceived) => {
			var chat = newMessageReceived.chatId;
			if (!chat.users) return console.log("chat.users not defined");
			chat.users.forEach((user) => {
				if (user == newMessageReceived.senderId) return;
				socket.in(user).emit("message received", newMessageReceived);
			});
		});
		socket.off("setup", () => {
			console.log("USER DISCONNECTED");
			socket.leave(userData._id);
		});
	});
};

StartServer();
