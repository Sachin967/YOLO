import express from "express";
import cors from "cors";
import { notification } from "./api/notification.js";

const expressApp = async (app, channel, io) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(cors());
	notification(app, channel, io);
};
export default expressApp;
