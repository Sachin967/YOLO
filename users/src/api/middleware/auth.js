import { GenerateSignature, ValidateSignature } from "../../utils/index.js";
import UserRepositary from "../../database/repositary/user-repositary.js";
import jwt from "jsonwebtoken";
import { APP_SECRET, REFRESH_SECRET } from "../../config/index.js";

export const UserAuth = async (req, res, next) => {
	const repo = new UserRepositary();
	const isAuthorized = await ValidateSignature(req);
	// Proceed with token verification

	try {
		const { refreshToken } = req.cookies;
		const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
		const isBlocked = await repo.IsBlocked(decoded._id);
		if (isAuthorized) {
			if (!isBlocked) {
				console.log("keri");
				return next();
			} else {
				return res.status(403).json({ message: "Not Authorized" });
			}
		}
		const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_SECRET);
		req.user = decodedRefreshToken;
		const newPayload = {
			email: req.user.email,
			_id: req.user._id
		};
		const { accessToken, newRefreshToken } = await GenerateSignature(res, newPayload);
		return next();
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: "Not Authorized" });
	}
};
