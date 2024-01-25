import PostRepositary from "../database/repositary/post-repositary.js";
import { FormateData } from "../utils/index.js";

class PostService {
	constructor() {
		this.repositary = new PostRepositary();
	}
	async AddPost(inputs) {
		const { userId, textmedia, location, privacy, media } = inputs;
		try {
			const post = await this.repositary.CreatePost({
				userId,
				textmedia,
				location,
				privacy,
				media
			});
			if (post) {
				return { status: true, message: "Post added" };
			}
		} catch (error) {
			console.log(error);
		}
	}
	async ShowPosts({ page, limit }) {
		try {
			const skip = (page - 1) * limit;
			const Posts = await this.repositary.FindPosts({ skip, limit });
			return { posts: Posts };
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async FetchPostDetail(postId) {
		try {
			const post = await this.repositary.FindPostById(postId);
			const usernames = post.comments.map((comment) => comment.username);
			return { post: post, usernames };
		} catch (error) {
			console.log(error);
		}
	}

	async LikePost(userId, postId) {
		try {
			const resp = await this.repositary.ManageLike(userId, postId);
			if (resp.status === "liked") {
				if (resp.post.userId != userId) {
					const payload = {
						event: "POSTS_LIKED",
						data: {
							recipient: resp.post.userId,
							senderId: userId,
							notificationType: "like",
							entityType: "post",
							entityId: postId,
							image: resp.post.media
						}
					};
					return { resp, payload };
				} else {
					return { resp };
				}
			} else if (resp.status === "unliked") {
				if (resp.post.userId != userId) {
					const payload = {
						event: "POSTS_UNLIKED",
						data: {
							recipient: resp.post.userId,
							senderId: userId,
							notificationType: "like"
						}
					};
					return { resp, payload };
				} else {
					return { resp };
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	async FetchLikedPost(userId) {
		try {
			const likedPosts = await this.repositary.LikedPosts(userId);
			return likedPosts;
		} catch (error) {
			console.log(error);
		}
	}

	async AddComment(commentInputs, userId) {
		try {
			const { content, username, postId } = commentInputs;
			const { reply, post } = await this.repositary.CreateComment(commentInputs);
			if (post.userId !== userId) {
				const payload = {
					event: "POSTS_COMMENTED",
					data: {
						recipient: post.userId,
						senderId: userId,
						notificationType: "comment",
						entityType: "post",
						entityId: postId,
						image: post.media
					}
				};
				return { payload, reply };
			}
			return { reply };
		} catch (error) {}
	}

	async FetchPostsofUser(id) {
		try {
			const posts = await this.repositary.FindUserPost(id);
			return posts;
		} catch (error) {}
	}

	async EditPost({ postId, textmedia, search }) {
		try {
			const updatedPost = await this.repositary.ModifyPost({ postId, textmedia, search });
			return updatedPost;
		} catch (error) {}
	}

	async deletePost(postId) {
		try {
			const res = await this.repositary.RemovePost(postId);
			return res;
		} catch (error) {}
	}
	async deleteComment(commentId) {
		try {
			const res = await this.repositary.RemoveComment(commentId);
			return res;
		} catch (error) {}
	}

	async ReportPost({ postId, username, reason }) {
		try {
			const reportedpost = await this.repositary.FlagPost({ postId, reason, username });
			return reportedpost;
		} catch (error) {}
	}

	async AddCommentReply({ username, replyText, commentId }) {
		try {
			const response = await this.repositary.CreateCommentReply({ commentId, replyText, username });
			return response;
		} catch (error) {}
	}

	async FetchUserFromPosts(postId) {
		try {
			const { userId } = await this.repositary.FindUserId(postId);
			return userId;
		} catch (error) {}
	}

	async serveRPCRequest(payload) {
		const { type, data } = payload;
		switch (type) {
			case "LIST_REPORTED_POSTS":
				return this.repositary.FindReportedPost();
			case "UNLIST_POST":
				return this.repositary.unListPost(data);
				break;
			case "LIST_POST":
				return this.repositary.listPost(data);
				break;
			case "POSTS_COUNT":
				return this.repositary.AveragePostsPerWeek();
				break;
			default:
				break;
		}
	}
}
export default PostService;
