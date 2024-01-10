import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		users: [{ type: String }],
		latestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message"
		},
		groupAdminId: { type: String },
		groupImage: { public_id: { type: String }, url: { type: String } }
	},
	{ timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
