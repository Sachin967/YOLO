import express from "express";
import cors from "cors";
import { admin } from "./api/admin.js";
const expressApp = async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://yolo.client.sachinms.fyi"],
      methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods
      allowedHeaders: ["Content-Type", "Authorization"], // Add allowed headers
      credentials: true, // Enable credentials (if needed)
    }),
  );
  admin(app, channel);
};
export default expressApp;
