import PostRepositary from "../database/repositary/post-repositary.js";
import { FormateData, PublishMessage, RPCRequest } from "../utils/index.js";

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
				return FormateData({ status: true, message: "Post added" });
			}
		} catch (error) {
			console.log(error);
		}
	}
	async ShowPosts({ page, limit }) {
		try {
			const skip = (page - 1) * limit;
			const Posts = await this.repositary.FindPosts({ skip, limit });
			const postUserIds = Posts.map((post) => post.userId);
			const batchSize = 50;
			const batches = [];

			for (let i = 0; i < postUserIds.length; i += batchSize) {
				batches.push(postUserIds.slice(i, i + batchSize));
			}
			const userData = [];

			for (const batch of batches) {
				const batchUserData = await RPCRequest("USER_RPC", {
					type: "FETCH_USERS",
					data: batch
				});
				userData.push(...batchUserData);
			}
			// Associating user details with respective posts
			Posts.forEach((post) => {
				const userDetail = userData.find((user) => user.id === post.userId);
				if (userDetail) {
					post.userDetails = userDetail; // Associating user details with the post
				}
			});

			return { posts: Posts, userData: userData };
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async FetchPostDetail(postId) {
		try {
			const post = await this.repositary.FindPostById(postId);

			// Extracting usernames from comments
			const usernames = post.comments.map((comment) => comment.username);

			// Batching the usernames for RPC request
			const batchSize = 100;
			const batches = [];
			for (let i = 0; i < usernames.length; i += batchSize) {
				batches.push(usernames.slice(i, i + batchSize));
			}

			const userData = [];

			// Making RPC calls to fetch user data in batches
			for (const batch of batches) {
				const batchUserData = await RPCRequest("USER_RPC", {
					type: "FETCH_USERS_BY_USERNAME",
					data: batch
				});
				userData.push(...batchUserData);
			}
			post.comments.forEach((comment) => {
				const userDetail = userData.find((user) => user.username === comment.username);
				if (userDetail) {
					comment.userDetails = userDetail; // Associate user details with the post
				}
			});
			// Return user data associated with comment users
			return { post: post, userData: userData };
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
							image: resp.post.media.url
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
			const likedPosts = this.repositary.LikedPosts(userId);
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
						image: post.media.url
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

	async EditPost({ postId, textmedia, location }) {
		try {
			const updatedPost = await this.repositary.ModifyPost({ postId, textmedia, location });
			return updatedPost;
		} catch (error) {}
	}

	async deletePost(postId) {
		try {
			const res = await this.repositary.RemovePost(postId);
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

	async FetchUserFromPosts(postId){
		try {
			const {userId} = await this.repositary.FindUserId(postId)
			console.log(userId)
			const response = await RPCRequest('USER_RPC',{
				type:"FETCH_USERS",
				data:userId
			})
			return response
		} catch (error) {
			
		}
	}

	async serveRPCRequest(payload) {
		const { type, data } = payload;
		switch (type) {
			case "LIST_POSTS":
				return this.repositary.FindPosts();
				break;
			case "LIST_REPORTED_POSTS":
				return this.repositary.FindReportedPost();
			case "USER_POSTS_LIKES":
				return this.repositary.FindUserPostAndLikes(data);
				break;
			case "SAVED_POSTS":
				console.log(data)
				return this.repositary.FetchSavedPosts(data)
			default:
				break;
		}
	}
}
export default PostService;
