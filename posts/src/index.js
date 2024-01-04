import express from "express";
import { dBConnection } from "./database/index.js";
import expressApp from "./expressApp.js";
import { PORT } from "./config/index.js";
import { createChannel } from "./utils/index.js";

const StartServer = async () => {
	const app = express();
	await dBConnection();
	const channel = await createChannel();
	await expressApp(app, channel);
	app.listen(PORT, () => console.log(`Posts is running on ${PORT}`)).on("error", (err) => {
		console.log(err);
		process.exit(1);
	});
};
StartServer();
