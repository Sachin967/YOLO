import { ValidateSignature } from "../../utils/index.js";
import UserRepositary from "../../database/repositary/user-repositary.js";
import jwt from 'jsonwebtoken'
import { APP_SECRET } from "../../config/index.js";

export const UserAuth = async (req, res, next) => {
	const repo = new UserRepositary();
	const isAuthorized = await ValidateSignature(req);
	const { userJwt } = req.cookies;
	const decoded = jwt.verify(userJwt, APP_SECRET);
	const { _id } = decoded;
	const isBlocked = await repo.IsBlocked(_id);
	if (isAuthorized && !isBlocked) {
		return next();
	}
	return res.status(403).json({ message: "Not Authorized" });
};
