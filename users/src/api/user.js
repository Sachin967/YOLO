import UserService from "../services/user-service.js";
import { UserAuth } from "./middleware/auth.js";
import { GenerateSignature, PublishMessage, RPCObserver, SubscribeMessage, sendOTP } from "../utils/index.js";
import { NOTIFICATION_BINDING_KEY } from "../config/index.js";
import express from "express";
export const user = (app, channel) => {
	const service = new UserService();
	SubscribeMessage(channel, service);
	RPCObserver("USER_RPC", service);
	const router = express.Router();
	router.post("/register", async (req, res, next) => {
		const { name, username, email, password, day, month, year, gender } = req.body;
		try {
			const { data } = await service.SignUp({ email, password, name, username, day, month, year, gender }, res);
			const { otp, id } = data;
			const otpResponse = await sendOTP(email, otp);
			const response = {
				Id: id,
				otpResponse: otpResponse
			};
			return res.json(response);
		} catch (error) {
			console.log(error);
			next(error);
		}
	});

	router.get(`/searchuser/:id`, async (req, res, next) => {
		try {
			const { id } = req.params;
			const getUsers = await service.FetchFollowersorFollowing(id);
			return res.json(getUsers);
		} catch (error) {}
	});

	router.post("/verifyOtp", async (req, res, next) => {
		const { otp, id } = req.body;
		try {
			const user = await service.repositary.FindUserById(id);
			if (otp === user.Otp) {
				const response = await service.repositary.updateUserVerification(id);
				return res.json(response);
			} else {
				return res.status(400).json({ status: false, message: "Invalid otp" });
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	});

	router.get("/notfollowers/:userId", async (req, res, next) => {
		try {
			console.log("notfollowers", req.cookies);
			const { userId } = req.params;
			const fetchNotfollowed = await service.FetchNotfollowedusers(userId);
			return res.json(fetchNotfollowed);
		} catch (error) {}
	});

	router.post("/login", async (req, res, next) => {
		const { query, password } = req.body;
		try {
			const { data } = await service.SignIn({ query, password }, res);
			return res.json(data);
		} catch (error) {
			console.log(error);
			next(error);
		}
	});
	router.post("/googleauth", async (req, res, next) => {
		const { name, email } = req.body;
		try {
			const { data } = await service.GoogleAuth({ name, email }, res);
			return res.json(data);
		} catch (error) {
			console.log(error);
			next(error);
		}
	});

	router.post("/sendemail", async (req, res, next) => {
		const { email } = req.body;
		try {
			const user = await service.repositary.FindUser(email);
			const generateResetToken = await service.repositary.generateResetToken(user._id);
			const sendEmail = await service.sendEmail(user.email, generateResetToken);
			return res.json({ status: true, message: "Reset Link has been send to your email", sendEmail });
		} catch (error) {
			console.log(error);
		}
	});

	router.get("/validatetoken/:token", async (req, res) => {
		try {
			const { token } = req.params;
			const validate = await service.repositary.validateResetToken(token);
			return res.json(validate);
		} catch (error) {}
	});

	router.post("/changepassword", async (req, res) => {
		try {
			const { userId, password } = req.body;
			const response = await service.ChangePassword(userId, password);
			return res.json(response);
		} catch (error) {}
	});

	router.put("/password", UserAuth, async (req, res) => {
		try {
			const { currentPassword, newPassword } = req.body;
			const id = req.user._id;
			const response = await service.ConfirmPasswordAndChangeIt({ currentPassword, newPassword, id });
			return res.json(response);
		} catch (error) {}
	});

	router.post("/logout", async (req, res, next) => {
		try {
			res.cookie("userJwt", "", {
				httpOnly: true,
				expires: new Date(0)
			});
			res.cookie("refreshToken", "", {
				httpOnly: true,
				expires: new Date(0)
			});
			res.status(200).json({ status: true, message: "Logged out" });
		} catch (error) {
			console.log(error);
		}
	});

	router.post("/resendotp", async (req, res, next) => {
		try {
			const { id } = req.body;
			const user = await service.ResendOtp(id);
			const otpResponse = await sendOTP(user.email, user.Otp);
			res.json(otpResponse);
		} catch (error) {}
	});

	router.get("/profile/:username", async (req, res, next) => {
		try {
			const { username } = req.params;
			const user = await service.GetUserProfile({ username });
			return res.json(user);
		} catch (error) {
			console.log(error);
		}
	});

	router.post("/addcoverimage/:username", async (req, res) => {
		try {
			const { username } = req.params;
			const { croppedImage } = req.body;
			const uploadCoverPic = await service.UploadCoverImage({ username, croppedImage });
			return res.json(uploadCoverPic);
		} catch (error) {
			console.log(error);
		}
	});

	router.post("/addprofileimage/:username", async (req, res) => {
		try {
			const { username } = req.params;
			const { croppedImage } = req.body;
			const uploadCoverPic = await service.UploadProfileImage({ username, croppedImage });
			return res.json(uploadCoverPic);
		} catch (error) {
			console.log(error);
		}
	});

	router.put("/editprofile/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const { name, bio, location, day, month, year } = req.body.updatedUser;

			const editedUser = await service.EditUser({ id, name, bio, location, day, month, year });
			return res.json(editedUser);
		} catch (error) {}
	});

	router.get("/fetchfollowers/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const fetchfollowers = await service.repositary.FindFollowers({ id });
			return res.json(fetchfollowers);
		} catch (error) {}
	});

	router.get("/fetchfollowing/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const fetchfollowing = await service.repositary.FindFollowing({ id });
			return res.json(fetchfollowing);
		} catch (error) {}
	});

	router.post("/follow-unfollow", async (req, res, next) => {
		try {
			const { userId, id } = req.body;
			const { resp, payload } = await service.UpdateFollow({ userId, id });
			if (payload && Object.keys(payload).length !== 0) {
				PublishMessage(channel, NOTIFICATION_BINDING_KEY, JSON.stringify(payload));
			}
			res.json(resp);
		} catch (error) {}
	});

	router.post("/followrequest", async (req, res, next) => {
		try {
			const { userId, id } = req.body;
			const { resp, payload } = await service.SendFollowRequest({ userId, id });
			if (payload && Object.keys(payload).length !== 0) {
				PublishMessage(channel, NOTIFICATION_BINDING_KEY, JSON.stringify(payload));
			}
			res.json(resp);
		} catch (error) {}
	});

	router.get("/usersearch/:search", UserAuth, async (req, res, next) => {
		try {
			const keyword = req.params.search;
			const user = await service.FindUser({ keyword }, req);
			res.json(user);
		} catch (error) {}
	});

	router.get("/savedpost/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const savedposts = await service.repositary.fetchSavedPosts({ id });
			return res.json(savedposts);
		} catch (error) {}
	});

	router.post("/savepost", async (req, res, next) => {
		try {
			const { postId, userId } = req.body;
			const savepost = await service.repositary.SavingPost({ postId, userId });
			return res.json(savepost);
		} catch (error) {}
	});

	router.post("/reportuser", UserAuth, async (req, res, next) => {
		try {
			const { userId, reason } = req.body;
			const id = req.user._id;
			const reportUser = await service.repositary.ReportingUser({ userId, id, reason });
			return res.json(reportUser);
		} catch (error) {
			console.log(error);
		}
	});
	router.get(`/getuser/:userId`, async (req, res, next) => {
		try {
			const { userId } = req.params;
			const user = await service.repositary.FindUserById(userId);
			return res.json(user);
		} catch (error) {}
	});

	router.get(`/getusers/:userIds`, async (req, res, next) => {
		try {
			const userIds = req.params.userIds.split(",");
			const user = await service.repositary.FindUsersById(userIds);
			return res.json(user);
		} catch (error) {}
	});

	router.get(`/usersget/:usernames`, async (req, res, next) => {
		try {
			const usernames = req.params.usernames.split(",");
			console.log(usernames);
			const user = await service.repositary.FindwithUserNames(usernames);
			return res.json(user);
		} catch (error) {}
	});

	router.put("/makeprivate/:userId", async (req, res, next) => {
		try {
			const { userId } = req.params;
			const { isChecked } = req.body;
			const makeprivate = await service.repositary.MakePrivateOrPublic({ isChecked, userId });
			return res.json(makeprivate);
		} catch (error) {}
	});

	router.get("/checkisblocked/:userId", async (req, res, next) => {
		try {
			const { userId } = req.params;

			const isBlocked = await service.repositary.IsBlocked(userId);
			// console.log('isBlocked',isBlocked)
			return res.json(isBlocked);
		} catch (error) {}
	});

	router.post("/generatetoken", async (req, res, next) => {
		try {
			console.log(req.body);
			const { newPayload } = req.body;
			const generate = await GenerateSignature(res, newPayload);
			console.log("generate", generate);
			return res.json(true);
		} catch (error) {}
	});

	app.use("/api/users", router);
};
