import { ValidateSignature } from "../../utils/index.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { REFRESH_SECRET } from "../../config/index.js";
export const UserAuth = async (req, res, next) => {
	const isAuthorized = await ValidateSignature(req);
	const { refreshToken } = req.cookies;
	const decoded = await jwt.verify(refreshToken, REFRESH_SECRET);
	if (isAuthorized) {
		// const isBlocked = await axios.get(`http://localhost:7100/api/users/checkisblocked/${decoded._id}`);
		const isBlocked = await axios.get(`https://yolo.sachinms.fyi/api/users/checkisblocked/${decoded._id}`);
		if (isBlocked.data === false) {
			return next();
		} else {
			return res.status(403).json({ message: "Not Authorized" });
		}
	}
	try {
		const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_SECRET);
		req.user = decodedRefreshToken;
		const newPayload = {
			email: req.user.email,
			_id: req.user._id
		};
		// const generatetoken = await axios.post(`http://localhost:7100/api/users/generatetoken`, { newPayload });
		const generatetoken = await axios.post(`https://yolo.sachinms.fyi/api/users/generatetoken`, { newPayload });
		if (generatetoken.data) {
			return next();
		}
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: "Not Authorized" });
	}
};
