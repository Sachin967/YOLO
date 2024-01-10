import express from "express";
import { PORT } from "./config/index.js";
import expressApp from "./expressApp.js";
import { dBConnection } from "./database/index.js";
import { CreateChannel } from "./utils/index.js";

const StartServer = async () => {
	const app = express();
	await dBConnection();
	const channel = await CreateChannel();
	await expressApp(app, channel);
	app.listen(PORT, () => console.log(`User is running on ${PORT}`)).on("error", (err) => {
		console.log(err);
		process.exit(1);
	});
};

StartServer();
