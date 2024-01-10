import UserService from "../services/user-service.js";
// import nodemailer from "nodemailer";
// import { GMAIL, PASS } from "../config/index.js";
import { UserAuth } from "./middleware/auth.js";
import { PublishMessage, RPCObserver, SubscribeMessage, sendOTP } from "../utils/index.js";
import { NOTIFICATION_BINDING_KEY } from "../config/index.js";
export const user = (app, channel) => {
	const service = new UserService();

	SubscribeMessage(channel, service);

	RPCObserver("USER_RPC", service);

	app.post("/register", async (req, res, next) => {
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

	app.get(`/searchuser/:id`, async (req, res, next) => {
		try {
			console.log(req.params);
			const { id } = req.params;
			const getUsers = await service.FetchFollowersorFollowing(id);
			return res.json(getUsers);
		} catch (error) { }
	});

	app.post("/verifyOtp", async (req, res, next) => {
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

	app.post("/login", async (req, res, next) => {
		const { query, password } = req.body;
		try {
			const { data } = await service.SignIn({ query, password }, res);
			return res.json(data);
		} catch (error) {
			console.log(error);
			next(error);
		}
	});
	app.post("/googleauth", async (req, res, next) => {
		const { name, email } = req.body;
		console.log(req.body);
		try {
			const { data } = await service.GoogleAuth({ name, email }, res);
			return res.json(data);
		} catch (error) {
			console.log(error);
			next(error);
		}
	});

	app.post('/sendemail', async (req, res, next) => {
		console.log(req.body)
		const { email } = req.body
		try {
			const user = await service.repositary.FindUser(email)
			const generateResetToken = await service.repositary.generateResetToken(user._id)
			const sendEmail = await service.sendEmail(user.email, generateResetToken)
			return res.json({ status: true, message: 'Reset Link has been send to your email', sendEmail })

		} catch (error) {
			console.log(error)
		}
	})

	app.get('/validatetoken/:token', async (req, res) => {
		try {
			const { token } = req.params
			const validate = await service.repositary.validateResetToken(token)
			return res.json(validate)
		} catch (error) {

		}
	})

	app.post('/changepassword', async (req, res) => {
		try {
			const { userId, password } = req.body
			const response = await service.ChangePassword(userId, password)
			return res.json(response)
		} catch (error) {

		}
	})

	app.post("/logout", async (req, res, next) => {
		try {
			res.cookie("userJwt", "", {
				httpOnly: true,
				expires: new Date(0)
			});
			res.status(200).json({ status: true, message: "Logged out" });
		} catch (error) {
			console.log(error);
		}
	});

	app.post("/resendotp", async (req, res, next) => {
		try {
			const { id } = req.body;
			const user = await service.ResendOtp(id);
			const otpResponse = await sendOTP(user.email, user.Otp);
			res.json(otpResponse);
		} catch (error) { }
	});

	app.get("/profile/:username", async (req, res, next) => {
		try {
			const { username } = req.params;
			const user = await service.GetUserProfile({ username });
			return res.json(user);
		} catch (error) {
			console.log(error);
		}
	});

	app.post("/addcoverimage/:username", async (req, res) => {
		try {
			const { username } = req.params;
			const { croppedImage } = req.body;
			const uploadCoverPic = await service.UploadCoverImage({ username, croppedImage });
			return res.json(uploadCoverPic);
		} catch (error) {
			console.log(error);
		}
	});

	app.post("/addprofileimage/:username", async (req, res) => {
		try {
			const { username } = req.params;
			const { croppedImage } = req.body;
			const uploadCoverPic = await service.UploadProfileImage({ username, croppedImage });
			return res.json(uploadCoverPic);
		} catch (error) {
			console.log(error);
		}
	});

	app.put("/editprofile/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			console.log(req.params)
console.log(req.body)
			const { name, bio, location, day, month, year } = req.body.updatedUser;

			const editedUser = await service.EditUser({ id, name, bio, location, day, month, year });
			return res.json(editedUser);
		} catch (error) { }
	});

	app.get("/fetchfollowers/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const fetchfollowers = await service.FetchFollowers({ id });
			return res.json(fetchfollowers);
		} catch (error) { }
	});

	app.get("/fetchfollowing/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const fetchfollowing = await service.FetchFollowing({ id });
			return res.json(fetchfollowing);
		} catch (error) { }
	});

	app.post("/follow-unfollow", async (req, res, next) => {
		try {
			const { userId, id } = req.body;
			const { resp, payload } = await service.UpdateFollow({ userId, id });
			if (payload && Object.keys(payload).length !== 0) {
				PublishMessage(channel, NOTIFICATION_BINDING_KEY, JSON.stringify(payload));
			}
			res.json(resp);
		} catch (error) { }
	});

	app.get("/users/:search", UserAuth, async (req, res, next) => {
		try {
			const keyword = req.params.search;
			console.log(keyword)
			const user = await service.FindUser({ keyword }, req);
			res.json(user);
			console.log(user);
		} catch (error) { }
	});

	app.get("/savedpost/:id", async (req, res, next) => {
		try {
			const { id } = req.params;
			const savedposts = await service.GetSavedPost({ id });
			return res.json(savedposts);
		} catch (error) { }
	});

	app.post("/savepost", async (req, res, next) => {
		try {
			const { postId, userId } = req.body;
			const savepost = await service.SavePost({ postId, userId });
			return res.json(savepost);
		} catch (error) { }
	});

	app.post("/reportuser", UserAuth, async (req, res, next) => {
		try {
			console.log(req.body)
			const { userId, reason } = req.body
			const id = req.user._id
			const reportUser = await service.ReportUser({ userId, id, reason })
			return res.json(reportUser)
		} catch (error) {
			console.log(error)
		}
	})
	app.get(`/getuser/:userId`, async (req, res, next) => {
		try {
			const { userId } = req.params
			const user = await service.repositary.FindUserById(userId)
			return res.json(user)
		} catch (error) {

		}
	})

};
