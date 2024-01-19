import express from "express";
import cors from "cors";
import { posts } from "./api/post.js";
import cookieParser from "cookie-parser";
const expressApp = async (app, channel) => {
	app.use(express.json({ limit: "30mb" }));
	app.use(express.urlencoded({ extended: true, limit: "30mb" }));
	app.use(
		cors({
			origin: ["http://localhost:4000", "https://yolomedia.sachinms.fyi"],
			methods: ["GET", "POST", "PUT", "DELETE"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
			exposedHeaders: ["Custom-Header"]
		})
	);

	app.use(cookieParser());
	// app.use(inspectHeaders);
	posts(app, channel);
};

export default expressApp;
