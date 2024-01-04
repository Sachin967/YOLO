import User from "../models/userModel.js";
import { APIError, STATUS_CODES } from "../../utils/app-error.js";
import { cloudinary } from "../../config/cloudinary.js";

class UserRepositary {
	async CreateUser({ name, email, password, username, salt, Otp }) {
		try {
			const user = new User({
				name,
				email,
				password,
				salt,
				username,
				Otp
			});
			const userResult = await user.save();
			return userResult;
		} catch (err) {
			console.error("Error saving user:", err);
			throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Create User");
		}
	}

	async FindUser(query) {
		try {
			const existingCustomer = await User.findOne({
				$or: [{ email: query }, { username: query }]
			});
			return existingCustomer;
		} catch (err) {
			console.log(err);
			throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Find Customer");
		}
	}
	async FindUserById(id) {
		try {
			const existingUser = await User.findOne({ _id: id });
			return existingUser;
		} catch (error) {
			console.log(err);
			throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Find Customer");
		}
	}

	async FindByUsername({ username }) {
		try {
			const existingUsername = await User.findOne({ username });
			return existingUsername;
		} catch (error) {
			console.log(err);
			throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Find Customer");
		}
	}

	async FindwithUserNames(usernames) {
		try {
			const users = await User.find({ username: { $in: usernames } });
			console.log("Mine" + users);
			return users;
		} catch (error) {
			throw new Error("Error fetching users by usernames: " + error.message);
		}
	}

	async FindUsersbyRegex(keyword) {
		try {
			console.log(keyword,"keyword")
			const users = await User.find({
				$or: [{ name: { $regex: keyword, $options: "i" } }, { username: { $regex: keyword, $options: "i" } }]
			});
			console.log("search",users)
			return users;
		} catch (error) { }
	}

	async IsBlocked(id) {
		try {
			const user = await User.findById(id);
			console.log(user);
			if (user.isBlocked) {
				return true;
			} else {
				return false;
			}
		} catch (error) { }
	}

	async updateUserVerification(id) {
		try {
			const updatedUser = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
			return {
				status: true,
				_id: updatedUser._id,
				name: updatedUser.name,
				username: updatedUser.username,
				bio: updatedUser.bio,
				propic: updatedUser.propic,
				coverpic: updatedUser.coverpic
			};
		} catch (error) {
			console.error("Error updating user verification:", error);
			throw error;
		}
	}
	// async fetchUsers(userIds) {
	// 	try {
	// 		console.log(userIds)
	// 		const { userId, id } = userIds;
	// 		if (userId && id) {
	// 			const user1 = await User.findById(userId);
	// 			const user2 = await User.findById(id);

	// 			return { user1, user2 };
	// 		}
	// 		const users = await User.find({ _id: { $in: userIds } });
	// 		console.log(users)
	// 		return users;
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
	async fetchUsers(userIds) {
		try {
			console.log(userIds);

			if (userIds && typeof userIds === "object") {
				const { userId, id } = userIds;
				if (userId && id) {
					const user1 = await User.findById(userId);
					const user2 = await User.findById(id);
					return { user1, user2 };
				}
			}

			if (!Array.isArray(userIds)) {
				console.log("notarray");
				const user = await User.findById(userIds);
				console.log(user);
				return user ? [user] : [];
			}

			const users = await User.find({ _id: { $in: userIds } });
			console.log("User", users);
			return users;
		} catch (error) {
			console.log(error);
			return [];
		}
	}

	async FindUsersById(data) {
		let arr = [];
		for (let d of data) {
			const sender = await User.findById(d);
			arr.push(sender);
		}
		return arr;
	}

	async updateOtp(id, otp) {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: id },
			{ $set: { Otp: otp } },
			{ new: true } // To return the updated document
		);

		return updatedUser;
	}

	async updateUser({ id, name, bio, location, day, month, year }) {
		try {
			const user = await User.findByIdAndUpdate({ _id: id }, { name, bio, location, day, month, year }, { new: true });

			return user;
		} catch (error) {
			console.log(error);
			// throw error; // Consider throwing the error for better handling in the calling function
		}
	}

	async AddCoverImage({ username, croppedImage }) {
		try {
			const users = await User.find({ coverpic: { $exists: false } });
			await Promise.all(
				users.map(async (user) => {
					if (!user.coverpic) {
						user.coverpic = {
							public_id: "",
							url: ""
						};
					}
					await user.save();
				})
			);
			const result = await cloudinary.uploader.upload(croppedImage, {
				folder: "pics"
			});
			const user = await User.findOneAndUpdate(
				{ username },
				{
					coverpic: {
						public_id: result.public_id,
						url: result.secure_url
					}
				}
			);
			await user.save();
			return { status: "uploaded" };
		} catch (error) { }
	}

	async AddProImage({ username, croppedImage }) {
		try {
			const users = await User.find({ propic: { $exists: false } });
			await Promise.all(
				users.map(async (user) => {
					if (!user.propic) {
						user.propic = {
							public_id: "",
							url: ""
						};
					}
					await user.save();
				})
			);
			const result = await cloudinary.uploader.upload(croppedImage, {
				folder: "pics"
			});
			const user = await User.findOneAndUpdate(
				{ username },
				{
					propic: {
						public_id: result.public_id,
						url: result.secure_url
					}
				}
			);
			await user.save();
			return { status: "uploaded" };
		} catch (error) { }
	}

	async ListUsers() {
		const users = await User.find();
		return users;
	}

	async Blockuser(data) {
		const blockedUser = await User.findOneAndUpdate({ _id: data }, { isBlocked: true }, { new: true });
		return blockedUser;
	}

	async unBlockuser(data) {
		const unblockeduser = await User.findOneAndUpdate({ _id: data }, { isBlocked: false }, { new: true });
		return unblockeduser;
	}

async ManageFollowUnfollow({ userId, id }) {
	const curruser = await User.findOne({ _id: id });
	const user = await User.findOne({ _id: userId });

	const followingIndex = curruser.following.indexOf(userId);
	const followerIndex = user.followers.indexOf(id);

	if (followingIndex === -1) {
		curruser.following.push(userId);
		await curruser.save();

		if (followerIndex === -1) {
			user.followers.push(id);
			await user.save();
		}

		return { status: "followed", following:curruser.following };
	} else {
		curruser.following.splice(followingIndex, 1);
		await curruser.save();

		if (followerIndex !== -1) {
			user.followers.splice(followerIndex, 1);
			await user.save();
		}

		return { status: "unfollowed", following: curruser.following };
	}
}

	async ReportingUser({ userId, id, reason }) {
		try {
			const existingReport = await User.findOne({
				_id: userId,
				"reports.reporterId": id
			});
			if (existingReport) {
				return { message: "Already reported the user" };
			}
			const user = await User.findOneAndUpdate({ _id:userId }, { $addToSet: { reports: { reporterId: id, reason } } });
			return { message: "Report added successfully" };
		} catch (error) { }
	}

	async FindFollowing({ id }) {
		try {
			const user = await User.findById(id).populate("following", "_id username name propic");
			return user;
		} catch (error) { }
	}

	async FindFollowers({ id }) {
		try {
			const user = await User.findById(id).populate("followers", "_id username name propic");
			return user;
		} catch (error) { }
	}

	async SavingPost({ userId, postId }) {
		try {
			const user = await User.findOne({ _id: userId });
			const existingIndex = user.bookmarks.findIndex((post) => post === postId);
			if (existingIndex === -1) {
				user.bookmarks.push(postId);
				const savedpost = await user.save();
				return { status: "saved", savedpost };
			} else {
				user.bookmarks.splice(existingIndex, 1);
				const savedpost = await user.save();
				return { status: "removed", savedpost };
			}
		} catch (error) { }
	}

	async fetchSavedPosts({ id }) {
		try {
			const post = await User.findOne({ _id: id });
			const postIds = post.bookmarks;
			return postIds;
		} catch (error) { }
	}

	async FindFollowersorFollowing(id) {
		try {
			const user = await User.findById(id)
				.populate("followers", "_id username name propic")
				.populate("following", "_id username name");
			if (user) {
				return user;
			} else {
				console.log("User not found");
				return null;
			}
		} catch (error) { }
	}
}

export default UserRepositary;
