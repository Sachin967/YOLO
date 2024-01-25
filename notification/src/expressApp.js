import express from "express";
import cors from "cors";
import { notification } from "./api/notification.js";

const expressApp = async (app, channel, server) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(
		cors({
			origin: ["http://localhost:4000", "https://yolomedia.sachinms.fyi"],
			methods: ["GET", "POST", "PUT", "DELETE"],
			allowedHeaders: ["Content-Type", "Authorization"],
			exposedHeaders: ["Custom-Header"]
		})
	);

	notification(app, channel, server);
};
export default expressApp;
