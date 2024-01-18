import express from "express";
import cors from "cors";
import { posts } from "./api/post.js";
import cookieParser from "cookie-parser";
const expressApp = async (app, channel) => {
	app.use(express.json({ limit: "30mb" }));
	app.use(express.urlencoded({ extended: true, limit: "30mb" }));
	const corsOptions = {
		origin: ["http://localhost:3000", "https://vercel.yolo.sachinms.fyi"],
		methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods
		allowedHeaders: ["Content-Type", "Authorization"], // Add allowed headers
		credentials: true // Enable credentials (if needed)
	};
	app.use(cors(corsOptions));
	app.use(cookieParser());
	// app.use(inspectHeaders);
	posts(app, channel);
};

export default expressApp;
