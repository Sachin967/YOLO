import express from "express";
import cors from "cors";
import { notification } from "./api/notification.js";

const expressApp = async (app, channel, io) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(
		cors({
			origin: ["http://localhost:3000", "https://yolo.dsrtdhea0ztnv.amplifyapp.com"],
			methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods
			allowedHeaders: ["Content-Type", "Authorization"] // Add allowed headers
		})
	);
	notification(app, channel, io);
};
export default expressApp;
