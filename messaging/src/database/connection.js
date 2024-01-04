import mongoose from "mongoose";
import { MONGODB_URL } from "../config/index.js";

const dBConnection = async () => {
	try {
		await mongoose.connect(MONGODB_URL);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1);
	}
};

export { dBConnection };
