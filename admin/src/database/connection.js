import mongoose from "mongoose";
import { MONGODB_URL } from "../config/index.js";

const dBConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
};

export { dBConnection };

