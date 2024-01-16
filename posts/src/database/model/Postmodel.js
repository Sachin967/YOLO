import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
	{
		textmedia: { type: String },
		media: { type: String },
		likes: [
			{
				user: { type: String },
				likedAt: { type: Date, default: Date.now }
			}
		],
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
		userId: { type: String },
		location: { type: String },
		tags: [{ type: String }],
		privacy: { type: String, enum: ["public", "private", "friends"] },
		reported: [
			{
				reporter: { type: String },
				reason: { type: String },
				createdAt: { type: Date, default: Date.now }
			}
		],
		isListed: { type: Boolean, default: true }
	},

	{ timestamps: true }
);

const Post = mongoose.model("post", PostSchema);

export default Post;
