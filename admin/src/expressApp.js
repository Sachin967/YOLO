import express from "express";
import cors from "cors";
import { admin } from "./api/admin.js";
const expressApp = async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://yolomedia.sachinms.fyi"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      exposedHeaders: ["Custom-Header"],
    })
  );

  admin(app, channel);
};
export default expressApp;
