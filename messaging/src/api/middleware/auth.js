import { ValidateSignature } from "../../utils/index.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { REFRESH_SECRET } from "../../config/index.js";
export const UserAuth = async (req, res, next) => {
	console.log(req.cookies);
	const isAuthorized = await ValidateSignature(req);
	const { refreshToken } = req.cookies;
	const decoded = await jwt.verify(refreshToken, REFRESH_SECRET);
	if (isAuthorized) {
		// const isBlocked = await axios.get(`https://yolo.sachinms.fyi/users/checkisblocked/${decoded._id}`);
		const isBlocked = await axios.get(`http://127.0.0.1:7100/users/checkisblocked/${decoded._id}`);
		if (isBlocked.data.status === false) {
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
		const generatetoken = await axios.post(`http://127.0.0.1:7100/users/generatetoken`, { newPayload });
		// const generatetoken = await axios.post(`https://yolo.sachinms.fyi/users/generatetoken`, { newPayload });
		if (generatetoken.data) {
			return next();
		}
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: "Not Authorized" });
	}
};
