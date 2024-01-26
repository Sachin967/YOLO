import UserRepositary from "../database/repositary/user-repositary.js";
import {
	GeneratePassword,
	GenerateSalt,
	GenerateSignature,
	FormateData,
	ValidatePassword,
	generateUsername,
	generateOTP
} from "../utils/index.js";
import { APIError } from "../utils/app-error.js";
import { GMAIL, PASS } from "../config/index.js";
import nodemailer from "nodemailer";
class UserService {
	constructor() {
		this.repositary = new UserRepositary();
	}
	async SignUp(userInputs, res) {
		const { email, password, name, username, day, month, year, gender } = userInputs;
		try {
			// create salt
			let salt = await GenerateSalt();
			let userPassword = await GeneratePassword(password, salt);
			let Otp = generateOTP();
			const dob = new Date(year, month - 1, day);
			const existingUser = await this.repositary.CreateUser({
				email,
				name,
				username,
				password: userPassword,
				salt,
				Otp,
				dob,
				gender
			});
			const token = await GenerateSignature(res, {
				email: email,
				_id: existingUser._id,
				isBlocked: existingUser.isBlocked
			});
			return FormateData({
				status: true,
				id: existingUser._id,
				email: existingUser.email,
				username: existingUser.username,
				otp: existingUser.Otp
			});
		} catch (err) {
			console.log(err);
			throw new APIError("Data Not found", err);
		}
	}

	async SignIn(userInputs, res) {
		const { query, password } = userInputs;
		try {
			const existingUser = await this.repositary.FindUser(query);
			if (existingUser?.isBlocked) {
				res.status(401).json("You are blocked");
			}
			if (existingUser && existingUser?.isVerified === false) {
				res.status(403).json("You are not verified");
			}
			if (existingUser) {
				const validPassword = await ValidatePassword(password, existingUser.salt, existingUser.password);
				if (validPassword) {
					const token = await GenerateSignature(res, {
						email: existingUser.email,
						_id: existingUser._id
					});
					const dob = new Date(existingUser.dateOfBirth);
					const year = dob.getFullYear();
					const month = dob.getMonth() + 1;
					const day = dob.getDate();
					return FormateData({
						status: true,
						_id: existingUser._id,
						email: existingUser.email,
						username: existingUser.username,
						name: existingUser.name,
						bio: existingUser.bio,
						propic: existingUser.propic,
						coverpic: existingUser.coverpic,
						followers: existingUser.followers,
						following: existingUser.following,
						year,
						month,
						day,
						isPrivate: existingUser.isPrivate
					});
				} else {
					return { data: { status: false, msg: "Incorrect password" } };
				}
			}
			return FormateData({ state: true, msg: "Register first" });
		} catch (err) {
			console.log(err);
			return FormateData({ state: true, msg: "Register first" });
			// throw new APIError("Data Not found", err);
		}
	}

	async GoogleAuth(userInputs, res) {
		const { name, email } = userInputs;
		try {
			let existingUser = await this.repositary.FindUser(email);
			if (existingUser && existingUser.isBlocked) {
				res.status(403).json("You are blocked");
			}
			if (!existingUser) {
				const username = generateUsername(name);
				let usernameExists = true;
				while (usernameExists) {
					const existingUsername = await this.repositary.FindByUsername(username);
					if (!existingUsername) {
						usernameExists = false;
					} else {
						username = generateUsername(name);
					}
				}
				const newUser = await this.repositary.CreateUser({
					email,
					name,
					username
				});
				existingUser = newUser;
			}
			const token = await GenerateSignature(res, {
				email: email,
				_id: existingUser._id
			});

			const dob = new Date(existingUser.dateOfBirth);
			const year = dob.getFullYear();
			const month = dob.getMonth() + 1;
			const day = dob.getDate();

			return FormateData({
				status: true,
				_id: existingUser._id,
				email: existingUser.email,
				username: existingUser.username,
				name: existingUser.name,
				bio: existingUser.bio,
				propic: existingUser.propic,
				coverpic: existingUser.coverpic,
				followers: existingUser.followers,
				following: existingUser.following,
				year,
				month,
				day,
				isPrivate: existingUser.isPrivate
			});
		} catch (error) {
			console.log(error);
			throw new APIError("Data Not found", error);
		}
	}

	async GetUserProfile({ username }) {
		try {
			const user = await this.repositary.FindByUsername({ username });
			return user;
		} catch (error) {
			console.log(error);
		}
	}

	async sendEmail(email, token) {
		console.log("token", token);
		return new Promise((resolve, reject) => {
			let transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: GMAIL,
					pass: PASS
				}
			});
			let mailOptions = {
				from: "your-email@gmail.com",
				to: email,
				subject: "[YOLO] Password Reset E-mail",
				text: `You're receiving this e-mail because you or someone else has requested a password reset for your user account at .Click the link below to reset your password: https://yolomedia.sachinms.fyi/reset-password/${token.reset_token}/${token.user_id}
				If you did not request a password reset you can safely ignore this email.`
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error.message);
					reject(error);
				} else {
					console.log("Email sent: " + info.response);
					resolve(info.response);
				}
			});
		});
	}

	async ChangePassword(userId, password) {
		try {
			let salt = await GenerateSalt();
			let userPassword = await GeneratePassword(password, salt);
			const Password = await this.repositary.updatePassword(userId, userPassword, salt);
			return Password;
		} catch (error) {}
	}

	async ConfirmPasswordAndChangeIt({ currentPassword, newPassword, id }) {
		try {
			const user = await this.repositary.FindUserById(id);
			const validPassword = await ValidatePassword(currentPassword, user.salt, user.password);
			if (validPassword) {
				const changepassword = await this.repositary.updatePassword(id, newPassword, user.salt);
				return changepassword;
			} else {
				return { status: "false", message: "The password you entered was incorrect." };
			}
		} catch (error) {}
	}

	async EditUser({ id, name, bio, location, day, month, year }) {
		try {
			const editedUser = await this.repositary.updateUser({ id, name, bio, location, day, month, year });
			const dob = new Date(editedUser.dateOfBirth);
			const y = dob.getFullYear();
			const m = dob.getMonth() + 1;
			const d = dob.getDate();
			return {
				id: editedUser._id,
				email: editedUser.email,
				propic: editedUser.propic,
				coverpic: editedUser.coverpic,
				followers: editedUser.followers,
				following: editedUser.following,
				username: editedUser.username,
				name: editedUser?.name,
				bio: editedUser?.bio,
				location: editedUser?.location,
				isPrivate: editedUser?.isPrivate,
				day: d,
				month: m,
				year: y
			};
		} catch (error) {
			console.log(error);
		}
	}

	async FetchNotfollowedusers(userId) {
		try {
			const usernotfollowed = await this.repositary.FindNotFollowed(userId);
			return usernotfollowed;
		} catch (error) {}
	}

	async UploadCoverImage({ username, croppedImage }) {
		try {
			const res = await this.repositary.AddCoverImage({ username, croppedImage });
			return res;
		} catch (error) {}
	}

	async UploadProfileImage({ username, croppedImage }) {
		try {
			const res = await this.repositary.AddProImage({ username, croppedImage });
			return res;
		} catch (error) {}
	}

	async UpdateFollow({ userId, id }) {
		try {
			const resp = await this.repositary.ManageFollowUnfollow({ userId, id });
			if (resp.status === "followed") {
				const payload = {
					event: "USER_FOLLOWED",
					data: {
						recipient: userId,
						senderId: id,
						notificationType: "follow",
						entityType: "user",
						entityId: id,
						image: resp?.user?.propic?.url
					}
				};
				return { resp, payload };
			} else if (resp.status === "unfollowed") {
				const payload = {
					event: "USER_UNFOLLOWED",
					data: {
						recipient: userId,
						senderId: id,
						notificationType: "follow",
						entityType: "user",
						entityId: id,
						image: resp?.user?.propic?.url
					}
				};
				return { resp, payload };
			}
		} catch (error) {
			console.log(error);
		}
	}

	async SendFollowRequest({ userId, id }) {
		try {
			const resp = await this.repositary.CreateRequest({ userId, id });
			if (resp.status === "requested") {
				const payload = {
					event: "FOLLOW_REQUESTED",
					data: {
						recipient: userId,
						senderId: id,
						notificationType: "request",
						entityType: "user",
						entityId: id,
						image: resp?.user?.propic?.url
					}
				};
				return { resp, payload };
			} else if (resp.status === "removed") {
				const payload = {
					event: "FOLLOW_REMOVED",
					data: {
						recipient: userId,
						senderId: id,
						notificationType: "request",
						entityType: "user",
						entityId: id,
						image: resp?.user?.propic?.url
					}
				};
				return { resp, payload };
			}
		} catch (error) {}
	}

	async FindUser({ keyword }, req) {
		try {
			const users = await this.repositary.FindUsersbyRegex(keyword);
			const filteredUsers = users.filter((user) => user._id.toString() !== req.user._id.toString());
			return filteredUsers;
		} catch (error) {}
	}

	async ResendOtp(id) {
		try {
			const otp = generateOTP();
			const updatedUser = await this.repositary.updateOtp(id, otp);
			return updatedUser;
		} catch (error) {}
	}
	async FetchFollowersorFollowing(id) {
		try {
			const followers = await this.repositary.FindFollowersorFollowing(id);
			return followers;
		} catch (error) {}
	}

	async SubscribeEvents(payload, channel) {
		payload = JSON.parse(payload);
		const { event, data } = payload;
		try {
			switch (event) {
				case "REQUEST_CONFIRMED":
					this.repositary.ManageFollowRequest(data);
					this.repositary.DeleteRequest(data);
					break;
				case "REQUEST_DELETED":
					this.repositary.DeleteRequest(data);
					break;
				default:
					break;
			}
		} catch (error) {}
	}

	async serveRPCRequest(payload) {
		const { type, data } = payload;
		switch (type) {
			case "LIST_USERS":
				return this.repositary.ListUsers();
				break;
			case "BLOCK_USER":
				return this.repositary.Blockuser(data);
				break;
			case "UNBLOCK_USER":
				return this.repositary.unBlockuser(data);
				break;
			case "COUNT_GENDERS":
				return this.repositary.CountUserbyGender();
			case "CATEGORIZE_BY_AGE":
				return this.repositary.CountUserbyAge();
			default:
				break;
		}
	}
}

export default UserService;
