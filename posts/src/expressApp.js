import express from "express";
import cors from "cors";
import { posts } from "./api/post.js";
import cookieParser from "cookie-parser";
const expressApp = async (app, channel) => {
	app.use(express.json({ limit: "30mb" }));
	app.use(express.urlencoded({ extended: true, limit: "30mb" }));
	app.use(
		cors({
			origin: ["http://localhost:3000", "https://yolo.dsrtdhea0ztnv.amplifyapp.com"],
			methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods
			allowedHeaders: ["Content-Type", "Authorization"], // Add allowed headers
			credentials: true // Enable credentials (if needed)
		})
	);
	app.use(cookieParser());
	// app.use(inspectHeaders);
	posts(app, channel);
};

export default expressApp;
