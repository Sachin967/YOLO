export const isSameSender = (messages, m, i, userId) => {
	return (
		i < messages.length - 1 &&
		(messages[i + 1].senderId !== m.senderId || messages[i + 1].senderId === undefined) &&
		messages[i].senderId !== userId
	);
};
export const isLastMessage = (messages, i, userId) => {
	return (
		i === messages.length - 1 &&
		messages[messages.length - 1].senderId !== userId &&
		messages[messages.length - 1].senderId
	);
};
