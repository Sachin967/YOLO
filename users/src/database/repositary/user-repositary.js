import User from "../models/userModel.js";
import { APIError, STATUS_CODES } from "../../utils/app-error.js";
import { cloudinary } from "../../config/cloudinary.js";
import crypto from "crypto";
import PasswordReset from "../models/PasswordResetModel.js";
class UserRepositary {
	async CreateUser({ name, email, password, username, salt, Otp, dob, gender }) {
		try {
			const user = new User({
				name,
				email,
				password,
				salt,
				username,
				isBlocked: false,
				Otp,
				dateOfBirth: dob,
				gender
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
			// throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Find Customer");
			return;
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

	async generateResetToken(userId) {
		const token = crypto.randomBytes(20).toString("hex");
		const expirationTime = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

		const resetEntry = new PasswordReset({
			user_id: userId,
			reset_token: token,
			expiry_timestamp: expirationTime
		});

		return resetEntry.save();
	}

	async validateResetToken(token) {
		try {
			const resetEntry = await PasswordReset.findOne({ reset_token: token }).populate("user_id").exec();

			if (!resetEntry) {
				return { status: false, message: "Invalid or expired token" };
			}

			const currentDate = new Date();
			if (resetEntry.expiry_timestamp < currentDate) {
				return { status: false, message: "Token has expired" };
			}

			// Token is valid and associated with the correct user
			return { status: true, resetEntry };
		} catch (error) {}
	}

	async updatePassword(userId, password, salt) {
		try {
			const user = await User.findByIdAndUpdate(userId, { password: password, salt: salt }, { new: true });
			return { status: true, message: "Password Updated" };
		} catch (error) {}
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
			return users;
		} catch (error) {
			throw new Error("Error fetching users by usernames: " + error.message);
		}
	}

	async FindUsersbyRegex(keyword) {
		try {
			const users = await User.find({
				$or: [{ name: { $regex: keyword, $options: "i" } }, { username: { $regex: keyword, $options: "i" } }]
			});
			return users;
		} catch (error) {}
	}

	async IsBlocked(id) {
		try {
			const user = await User.findById(id);
			if (user.isBlocked) {
				return true;
			} else {
				return false;
			}
		} catch (error) {}
	}

	async updateUserVerification(id) {
		try {
			const updatedUser = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
			const dob = new Date(updatedUser.dateOfBirth);
			const year = dob.getFullYear();
			const month = dob.getMonth() + 1;
			const day = dob.getDate();
			return {
				status: true,
				_id: updatedUser._id,
				name: updatedUser.name,
				username: updatedUser.username,
				bio: updatedUser.bio,
				propic: updatedUser.propic,
				coverpic: updatedUser.coverpic,
				day,
				month,
				year
			};
		} catch (error) {
			console.error("Error updating user verification:", error);
			throw error;
		}
	}

	async FindNotFollowed(userId) {
		try {
			const user = await User.findById(userId);
			const userNotFollowing = await User.find({
				_id: { $nin: [...user.following, userId] }
			}).limit(5);
			return userNotFollowing;
		} catch (error) {}
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

	// async updateUser({ id, name, bio, location, day, month, year }) {
	// 	try {
	// 		const dob = new Date(year, month - 1, day);
	// 		const user = await User.findByIdAndUpdate({ _id: id }, { name, bio, location, dateOfBirth: dob }, { new: true });
	// 		return user;
	// 	} catch (error) {
	// 		console.log(error);
	// 		// throw error; // Consider throwing the error for better handling in the calling function
	// 	}
	// }

	async updateUser({ id, name, bio, location, day, month, year }) {
		try {
			console.log("======", id);
			const dob = new Date(year, month - 1, day);
			const updatedUser = await User.findByIdAndUpdate(
				id,
				{
					$set: {
						name,
						bio,
						location,
						dateOfBirth: dob
					}
				},
				{ new: true, upsert: true }
			);
			return updatedUser;
		} catch (error) {
			console.log(error);
			// Handle the error or rethrow it for better handling in the calling function
			throw error;
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
		} catch (error) {}
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
		} catch (error) {}
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

			return { status: "followed", following: curruser.following };
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

	async ManageFollowRequest({ userId, id }) {
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
			console.log("Done");
		} else {
			curruser.following.splice(followingIndex, 1);
			await curruser.save();

			if (followerIndex !== -1) {
				user.followers.splice(followerIndex, 1);
				await user.save();
			}
			console.log("gone");
		}

		const followRequestsIndex = user.followRequests.indexOf(id);
		if (followRequestsIndex !== -1) {
			await User.updateOne({ _id: userId }, { $pull: { followRequests: id } });
		}
	}

	async DeleteRequest({ userId, id }) {
		const user = await User.findById(userId);
		const followRequestsIndex = user.followRequests.indexOf(id);
		if (followRequestsIndex !== -1) {
			user.followRequests.splice(followRequestsIndex, 1);
			await user.save();
		}
	}

	async CreateRequest({ userId, id }) {
		try {
			const user = await User.findOne({ _id: userId });
			if (!user.followRequests) {
				// If the field doesn't exist or is falsy, update the document
				await User.findByIdAndUpdate(userId, { followRequests: [] }, { new: true });
			}
			const followRequestsIndex = user.followRequests.indexOf(id);

			if (followRequestsIndex === -1) {
				user.followRequests.push(id);
				await user.save();
				return { status: "requested" };
			} else {
				user.followRequests.splice(followRequestsIndex, 1);
				await user.save();
				return { status: "removed" };
			}
		} catch (error) {}
	}

	async MakePrivateOrPublic({ isChecked, userId }) {
		try {
			const user = await User.findById(userId);
			if (!user.isPrivate) {
				await User.findByIdAndUpdate(userId, { isPrivate: false }, { new: true });
			}
			if (isChecked) {
				await User.findByIdAndUpdate(userId, { isPrivate: false }, { new: true });
				return { isPrivate: false };
			} else {
				await User.findByIdAndUpdate(userId, { isPrivate: true }, { new: true });
				return { isPrivate: true };
			}
		} catch (error) {}
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
			const user = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { reports: { reporterId: id, reason } } });
			return { message: "Report added successfully" };
		} catch (error) {}
	}

	async FindFollowing({ id }) {
		try {
			const user = await User.findById(id).populate("following", "_id username name propic");
			return user;
		} catch (error) {}
	}

	async FindFollowers({ id }) {
		try {
			const user = await User.findById(id).populate("followers", "_id username name propic");
			return user;
		} catch (error) {}
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
		} catch (error) {}
	}

	async fetchSavedPosts({ id }) {
		try {
			const post = await User.findOne({ _id: id });
			const postIds = post.bookmarks;
			return postIds;
		} catch (error) {}
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
		} catch (error) {}
	}

	async CountUserbyGender() {
		try {
			console.log("hii");
			const maleCount = await User.find({ gender: "Male" }).countDocuments();
			const femaleCount = await User.find({ gender: "Female" }).countDocuments();
			const otherCount = await User.find({ gender: "Other" }).countDocuments();
			console.log(maleCount);
			return { maleCount, femaleCount, otherCount };
		} catch (error) {}
	}

	async CountUserbyAge() {
		try {
			const currentDate = new Date();
			const Age15 = new Date(currentDate);
			const Age20 = new Date(currentDate);
			const Age25 = new Date(currentDate);
			const Age30 = new Date(currentDate);
			Age15.setFullYear(currentDate.getFullYear() - 15);
			Age20.setFullYear(currentDate.getFullYear() - 20);
			Age25.setFullYear(currentDate.getFullYear() - 25);
			Age30.setFullYear(currentDate.getFullYear() - 30);
			const between15and20 = await User.find({
				dateOfBirth: {
					$lte: Age15,
					$gte: Age20
				}
			}).countDocuments();
			const between20and25 = await User.find({
				dateOfBirth: {
					$lte: Age20,
					$gte: Age25
				}
			}).countDocuments();
			const between25and30 = await User.find({
				dateOfBirth: {
					$lte: Age25,
					$gte: Age30
				}
			}).countDocuments();
			return { between15and20, between20and25, between25and30 };
		} catch (error) {}
	}
}

export default UserRepositary;
