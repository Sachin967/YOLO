import express from "express";
import cors from "cors";
import { user } from "./api/user.js";
import ErrorHandler from "./utils/Error-handler.js";
import cookieParser from "cookie-parser";
const expressApp = async (app, channel) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(
		cors({
			origin: ["http://localhost:3000", "https://vercel.yolo.sachinms.fyi"],
			methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods
			allowedHeaders: ["Content-Type", "Authorization"], // Add allowed headers
			credentials: true // Enable credentials (if needed)
		})
	);
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});
	app.use(cookieParser());
	user(app, channel);
	app.use(ErrorHandler);
};

export default expressApp;
