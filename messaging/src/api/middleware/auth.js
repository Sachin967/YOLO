import { UserisBlocked, ValidateSignature } from "../../utils/index.js";

export const UserAuth = async (req, res, next) => {
	const isAuthorized = await ValidateSignature(req);
	const isBlocked = await UserisBlocked(req);
	if (isAuthorized && !isBlocked) {
		return next();
	}
	return res.status(403).json({ message: "Not Authorized" });
};
