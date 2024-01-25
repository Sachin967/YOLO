import express from "express";
import { dBConnection } from "./database/index.js";
import { PORT } from "./config/index.js";
import expressApp from "./express-app.js";
import { Server } from "socket.io";
const StartServer = async () => {
	const app = express();
	await dBConnection();

	const server = app
		.listen(PORT, () => console.log(`Messaging running on ${PORT}`))
		.on("error", (err) => {
			console.log(err);
		});
	await expressApp(app, server);
};

StartServer();
