import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: { type: String },
		email: { type: String },
		username: { type: String },
		password: { type: String },
		propic: { public_id: { type: String }, url: { type: String } },
		coverpic: { public_id: { type: String }, url: { type: String } },
		bio: { type: String },
		salt: { type: String },
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "user"
			}
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "user"
			}
		],
		bookmarks: [{ type: String }],
		isBlocked: { type: Boolean, default: false },
		isVerified: { type: Boolean, default: false },
		googleAuth: { type: Boolean, default: false },
		Otp: { type: String },
		reportedPosts: [{ type: String }],
		reports: [
			{
				reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
				reason: { type: String },
				createdAt: { type: Date, default: Date.now }
			}
		],
		dateOfBirth: {
			type: Date
		},
		gender: {
			type: String,
			enum: ["Male", "Female", "Other"]
		}
	},
	{ timestamps: true }
);

const User = mongoose.model("user", UserSchema);

export default User;
