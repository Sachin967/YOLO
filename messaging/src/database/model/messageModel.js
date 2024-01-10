import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
	{
		senderId: { type: String },
		content: { type: mongoose.Schema.Types.Mixed },
		chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
		readBy: [{ type: String }]
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
