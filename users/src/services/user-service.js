import UserRepositary from "../database/repositary/user-repositary.js";
import {
	GeneratePassword,
	GenerateSalt,
	GenerateSignature,
	FormateData,
	ValidatePassword,
	ValidateSignature,
	generateUsername,
	generateOTP,
	PublishMessage,
	RPCRequest
} from "../utils/index.js";
import { APIError } from "../utils/app-error.js";
import { ADMIN_BINDING_KEY } from "../config/index.js";
import { user } from "../api/user.js";

class UserService {
	constructor() {
		this.repositary = new UserRepositary();
	}
	async SignUp(userInputs, res) {
		const { email, password, name, username } = userInputs;
		try {
			// create salt
			let salt = await GenerateSalt();
			let userPassword = await GeneratePassword(password, salt);
			let Otp = generateOTP();
			const existingUser = await this.repositary.CreateUser({
				email,
				name,
				username,
				password: userPassword,
				salt,
				Otp
			});
			const token = await GenerateSignature(res, {
				email: email,
				_id: existingUser._id
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
			if (existingUser.isBlocked) {
				res.status(401).json("You are blocked");
			}
			if (existingUser) {
				const validPassword = await ValidatePassword(password, existingUser.salt, existingUser.password);
				if (validPassword) {
					const token = await GenerateSignature(res, {
						email: existingUser.email,
						_id: existingUser._id
					});
					return FormateData({
						status: true,
						_id: existingUser._id,
						email: existingUser.email,
						username: existingUser.username,
						name: existingUser.name,
						bio: existingUser.bio,
						propic: existingUser.propic,
						coverpic: existingUser.coverpic,
						followers:existingUser.followers,
						following: existingUser.following

					});
				} else {
					return res.json({ msg: "Incorrect password" });
				}
			}
			return FormateData(null);
		} catch (err) {
			console.log(err);
			throw new APIError("Data Not found", err);
		}
	}

	async GoogleAuth(userInputs, res) {
		const { name, email } = userInputs;
		try {
			let existingUser = await this.repositary.FindUser(email);
			if (existingUser && existingUser.isBlocked) {
				res.status(401).json("You are blocked");
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

			return FormateData({
				status: true,
				_id: existingUser._id,
				email: existingUser.email,
				username: existingUser.username,
				name: existingUser.name,
				bio: existingUser.bio,
				propic: existingUser.propic,
				coverpic: existingUser.coverpic,
				followers:existingUser.followers,
				following:existingUser.following
			});
		} catch (error) {
			console.log(error);
			throw new APIError("Data Not found", error);
		}
	}

	async GetUserProfile({ username }) {
		try {
			const user = await this.repositary.FindByUsername({ username });

			const response = await RPCRequest("POST_RPC", {
				type: "USER_POSTS_LIKES",
				data: user._id
			});
			return { user, response };
		} catch (error) {
			console.log(error);
		}
	}

	async EditUser({ id, name, bio, location, day, month, year }) {
		try {
			const editedUser = await this.repositary.updateUser({ id, name, bio, location, day, month, year });
			return editedUser;
		} catch (error) {
			console.log(error);
		}
	}

	async UploadCoverImage({ username, croppedImage }) {
		try {
			const res = await this.repositary.AddCoverImage({ username, croppedImage });
			return res;
		} catch (error) { }
	}

	async UploadProfileImage({ username, croppedImage }) {
		try {
			const res = await this.repositary.AddProImage({ username, croppedImage });
			return res;
		} catch (error) { }
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
			} else if (resp.status ==='unfollowed') {
				
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

	async FindUser({ keyword }, req) {
		try {
			const users = await this.repositary.FindUsersbyRegex(keyword);
			const filteredUsers = users.filter((user) => user._id.toString() !== req.user._id.toString());
			return filteredUsers;
		} catch (error) { }
	}

	async ResendOtp(id) {
		try {
			const otp = generateOTP();
			const updatedUser = await this.repositary.updateOtp(id, otp);
			return updatedUser;
		} catch (error) { }
	}

	async FetchFollowing({ id }) {
		try {
			const following = await this.repositary.FindFollowing({ id });
			return following;
		} catch (error) { }
	}
	async FetchFollowers({ id }) {
		try {
			const followers = await this.repositary.FindFollowers({ id });
			return followers;
		} catch (error) { }
	}

	async FetchFollowersorFollowing(id) {
		try {
			const followers = await this.repositary.FindFollowersorFollowing(id);
			return followers;
		} catch (error) { }
	}

	async SavePost({ postId, userId }) {
		try {
			const post = await this.repositary.SavingPost({ userId, postId });
			return post;
		} catch (error) { }
	}

	async ReportUser({ userId, id, reason }) {
		try {
			const reportedUser = await this.repositary.ReportingUser({ userId, id, reason })
			return reportedUser
		} catch (error) {
			console.log(error)
		}
	}

	async GetSavedPost({ id }) {
		try {
			const postIds = await this.repositary.fetchSavedPosts({ id });
			const response = await RPCRequest("POST_RPC", {
				type: "SAVED_POSTS",
				data: postIds
			});
			// console.log("qp"+response)
			const userIds = response.map((post) => {
				console.log("pppp" + post._id)
				return post.userId;
			});
			console.log(userIds)
			const users = await this.repositary.FindUsersById(userIds)
			return { users, response };
		} catch (error) { }
	}

	async SubscribeEvents(payload, channel) {
		payload = JSON.parse(payload);
		const { event, data } = payload;
		try {
			switch (event) {
				case "LIST_USERS":
					const users = await this.repositary.ListUsers();
					const userData = JSON.stringify({ event: "USERS_FETCHED", data: users });
					PublishMessage(channel, ADMIN_BINDING_KEY, userData);
					break;
				case "REPORT_USERPOST":
					this.repositary.ReportUser(data);

				default:
					break;
			}
		} catch (error) { }
	}

	async serveRPCRequest(payload) {
		const { type, data } = payload;
		switch (type) {
			case "FETCH_USERS_BY_USERNAME":
				return this.repositary.FindwithUserNames(data);
			case "FETCH_USERS":
				return this.repositary.fetchUsers(data);
				break;
			case "LIST_USERS":
				return this.repositary.ListUsers();
				break;
			case "BLOCK_USER":
				return this.repositary.Blockuser(data);
				break;
			case "UNBLOCK_USER":
				return this.repositary.unBlockuser(data);
				break;
			case "CHECK_IS_BLOCKED":
				return this.repositary.IsBlocked(data);
			case "FETCH_USERS_BYID":
				return this.repositary.FindUsersById(data);
			default:
				break;
		}
	}
}

export default UserService;
