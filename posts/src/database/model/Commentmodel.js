import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
	{
		postId: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
		username: { type: String },
		content: { type: String },
		media: { type: String },
		likes: [{ type: String }],
		replies: [
			{
				username: { type: String },
				replyText: { type: String, required: true },
				likes: [{ type: String }],
				createdAt: { type: Date, default: Date.now }
			}
		]
	},
	{ timestamps: true }
);

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;
