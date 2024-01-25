import express from "express";
import cors from "cors";
import ErrorHandler from "./utils/Error-handler.js";
import { message } from "./api/message.js";
import cookieParser from "cookie-parser";

const expressApp = async (app, server) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(
		cors({
			origin: ["http://localhost:4000", "https://yolomedia.sachinms.fyi"],
			methods: ["GET", "POST", "PUT", "DELETE"],
			allowedHeaders: ["Content-Type", "Authorization"],
			exposedHeaders: ["Custom-Header"],
			credentials: true
		})
	);
	app.use(cookieParser());
	message(app, server);
	app.use(ErrorHandler);
};
export default expressApp;
