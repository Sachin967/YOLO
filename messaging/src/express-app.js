import express from "express";
import cors from "cors";
import ErrorHandler from "./utils/Error-handler.js";
import { message } from "./api/message.js";

const expressApp = async (app) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(
		cors({
			origin: ["http://localhost:3000", "https://yolo.client.sachinms.fyi"],
			methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods
			allowedHeaders: ["Content-Type", "Authorization"] // Add acredentials: true
		})
	);
	app.use(ErrorHandler);
	message(app);
};
export default expressApp;
