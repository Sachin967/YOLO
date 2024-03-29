import mongoose from "mongoose";
import { MONGODB_URL } from "../config/index.js";

export const dBConnection = async () => {
	try {
		await mongoose.connect(MONGODB_URL);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};
