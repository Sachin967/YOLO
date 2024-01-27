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
	app.use((err, req, res, next) => {
		console.error(err.stack);
		// res.status(500).send('Something went wrong!');
	});
	app.all("*", (req, res) => {
		res.status(404).send("Not Found");
	});
};
export default expressApp;
