import express from "express";
import cors from "cors";
import { user } from "./api/user.js";
import ErrorHandler from "./utils/Error-handler.js";
import cookieParser from "cookie-parser";
const expressApp = async (app, channel) => {
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ extended: true, limit: "10mb" }));
	app.use(
		cors({
			origin: ["http://localhost:3000", "https://yolo.client.sachinms.fyi"],
			methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods
			allowedHeaders: ["Content-Type", "Authorization"], // Add allowed headers
			credentials: true // Enable credentials (if needed)
		})
	);
	// app.use(cors())
	app.use(cookieParser());
	user(app, channel);
	app.use(ErrorHandler);
};

export default expressApp;
