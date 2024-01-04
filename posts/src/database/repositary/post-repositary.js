import Post from "../model/Postmodel.js";
import Comment from "../model/Commentmodel.js";
import { cloudinary } from "../../config/cloudinary.js";
class PostRepositary {
	async CreatePost({ userId, textmedia, location, privacy, media }) {
		try {
			const result = await cloudinary.uploader.upload(media, {
				folder: "products"
			});
			const post = new Post({
				userId,
				textmedia,
				location,
				likes: [],
				comments: [],
				privacy,
				media: {
					public_id: result.public_id,
					url: result.secure_url
				}
			});
			return await post.save();
		} catch (error) {
			console.log(error.message);
		}
	}
	async FindPostById(postId) {
		try {
			const post = await Post.findOne({ _id: postId }).populate("comments");
			return post;
		} catch (error) {
			console.log(error);
		}
	}
	async FindPosts({ skip, limit }) {
		try {
			const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
			console.log(posts);
			return posts;
		} catch (error) {
			console.log(error);
		}
	}

	async FindReportedPost() {
		try {
			const posts = await Post.find({ reported: { $exists: true, $not: { $size: 0 } } });
			return posts;
		} catch (error) { }
	}

	async FindUserPostAndLikes(id) {
		try {
			const posts = await Post.find({ userId: id });
			const likedposts = await Post.find({ likes: { $elemMatch: { user: id } } });
			return { posts, likedposts };
		} catch (error) {
			console.log(error);
		}
	}

	async FindUserPost(id) {
		try {
			const posts = await Post.find({ userId: id });
			return posts;
		} catch (error) {
			console.log(error);
		}
	}

	async ManageLike(userId, postId) {
		try {
			const post = await Post.findOne({ _id: postId });
			const existingLikeIndex = post.likes.findIndex((like) => like.user === userId);
			if (existingLikeIndex === -1) {
				post.likes.push({ user: userId, likedAt: new Date() });
				const savedPost = await post.save();
				const likeCount = post.likes.length;
				const CommentCount = post.comments.length;
				return { post: savedPost, status: "liked", likeCount };
			} else {
				post.likes.splice(existingLikeIndex, 1);
				const savedPost = await post.save();
				const likeCount = post.likes.length;
				return { post: savedPost, status: "unliked", likeCount };
			}
		} catch (error) { }
	}
	async LikedPosts(userId) {
		try {
			const likedPosts = await Post.find({ likes: { $elemMatch: { user: userId } } });
			return likedPosts;
		} catch (error) { }
	}
	async CreateComment({ content, username, postId }) {
		try {
			const comment = new Comment({
				postId,
				username,
				content
			});
			const reply = await comment.save();
			const post = await Post.findByIdAndUpdate({ _id: postId }, { $addToSet: { comments: reply._id } }, { new: true });
			return { reply, post };
		} catch (error) {
			console.log(error);
		}
	}

	async ModifyPost({ postId, textmedia, location }) {
		try {
			const post = await Post.findByIdAndUpdate({ _id: postId }, { textmedia, location }, { new: true });
			return post;
		} catch (error) {
			console.log(error);
		}
	}

	async RemovePost(postId) {
		try {
			const deletedPost = await Post.findOneAndDelete({ _id: postId });
			if (!deletedPost) {
				// return { status: "Post not found" };
			}
			return { status: "Post Deleted" };
		} catch (error) {
			console.log(error);
		}
	}

	async FlagPost({ postId, username, reason }) {
		try {
			const postsToUpdate = await Post.find({ $or: [{ reported: { $exists: false } }, { reported: [] }] });
			// Update each post to include the `reported` field
			await Promise.all(
				postsToUpdate.map(async (post) => {
					if (!post.reported) {
						post.reported = []; // Initialize the field with an empty array if it doesn't exist
					}
					await post.save(); // Save the updated post
				})
			);
			const existingReport = await Post.findOne({
				_id: postId,
				"reported.reporter": username
			});
			if (existingReport) {
				return { message: "Already reported the post" };
			}
			const reportedPost = await Post.findOneAndUpdate(
				{ _id: postId },
				{
					$push: {
						reported: {
							reason: reason,
							reporter: username,
							createdAt: new Date() // Optionally include createdAt timestamp
						}
					}
				},
				{ new: true } // To return the updated document
			);
			if (reportedPost) {
				return reportedPost;
			}
		} catch (error) { }
	}

	async FetchSavedPosts(postIds) {
		try {
			console.log("l", postIds)
			const posts = await Post.find({ _id: { $in: postIds } })
			return posts
		} catch (error) { }
	}

	async CreateCommentReply({ username, replyText, commentId }) {
		try {
			const comment = await Comment.findOneAndUpdate(
				{ _id: commentId },
				{ $push: { replies: { username, replyText } } },
				{ new: true }
			);
			return comment;
		} catch (error) { }
	}

	async FindUserId(postId) {
		try {
			const userId = await Post.findOne({ _id: postId }, { userId: 1, _id: 0 })
			return userId
		} catch (error) {

		}
	}
}

export default PostRepositary;
