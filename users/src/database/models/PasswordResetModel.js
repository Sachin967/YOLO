import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
	reset_token: String,
	expiry_timestamp: Date
});

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);

export default PasswordReset;
