import { upload } from "../config/fileupload-s3.js";
import { NOTIFICATION_BINDING_KEY, USER_BINDING_KEY } from "../config/index.js";
import PostService from "../services/post-service.js";
import { PublishMessage, RPCObserver } from "../utils/index.js";
import { UserAuth } from "./middleware/auth.js";
import express from "express";
// import { UserAuth } from "./middleware/auth.js";
export const posts = (app, channel) => {
	const router = express.Router();

	const service = new PostService();
	RPCObserver("POST_RPC", service);

	router.post("/addpost", UserAuth, upload.single("media"), async (req, res, next) => {
		const media = req.file.location;
		const { userId, location, privacy, textmedia } = req.body;
		try {
			const response = await service.AddPost({ userId, location, textmedia, privacy, media });
			return res.json(response);
		} catch (error) {
			console.log(error);
		}
	});

	router.get("/likedAndUserPosts/:userId", UserAuth, async (req, res, next) => {
		try {
			const { userId } = req.params;
			const response = await service.repositary.FindUserPostAndLikes(userId);
			return res.json(response);
		} catch (error) {
			console.log(error);
		}
	});

	router.get("/seeposts", UserAuth, async (req, res, next) => {
		try {
			const { page, limit } = req.query;
			const response = await service.ShowPosts({ page, limit });
			return res.json(response);
		} catch (error) {
			console.log(error);
		}
	});
	router.post("/likepost", UserAuth, async (req, res, next) => {
		try {
			const { userId, postId } = req.body;
			const { resp, payload } = await service.LikePost(userId, postId);
			if (payload && Object.keys(payload).length !== 0) {
				console.log(payload);
				PublishMessage(channel, NOTIFICATION_BINDING_KEY, JSON.stringify(payload));
			}
			return res.json(resp);
		} catch (error) {
			console.log(error);
		}
	});

	router.post("/likedPosts", UserAuth, async (req, res) => {
		try {
			const { userId } = req.body;
			const likedPosts = await service.FetchLikedPost(userId);
			res.status(200).json({ success: true, likedPosts });
		} catch (error) {
			res.status(500).json({ error: "Could not fetch liked posts" });
		}
	});
	router.post("/addcomment", UserAuth, async (req, res) => {
		try {
			const { content, username, postId } = req.body;
			const userId = req.user._id;
			const { payload, reply } = await service.AddComment({ content, username, postId }, userId);
			if (payload && Object.keys(payload).length !== 0) {
				PublishMessage(channel, NOTIFICATION_BINDING_KEY, JSON.stringify(payload));
			}
			return res.json({ status: true, reply });
		} catch (error) {}
	});
	router.get("/fetchUserPosts/:id", UserAuth, async (req, res) => {
		try {
			const { id } = req.params;
			const posts = await service.FetchPostsofUser(id);
			return res.json(posts);
		} catch (error) {}
	});
	router.post("/postdetails", UserAuth, async (req, res) => {
		try {
			console.log(req.body);
			const { postId } = req.body;
			const response = await service.FetchPostDetail(postId);
			res.json({ status: true, response });
		} catch (error) {}
	});

	router.put("/editpost/:postId", UserAuth, async (req, res) => {
		try {
			const { postId } = req.params;
			const { textmedia, search } = req.body.requestData;
			const editedPost = await service.EditPost({ postId, textmedia, search });
			return res.json(editedPost);
		} catch (error) {
			console.log(error);
		}
	});

	router.delete("/deletepost/:postId", UserAuth, async (req, res) => {
		const { postId } = req.params;
		const response = await service.deletePost(postId);
		return res.json(response);
	});

	router.delete("/deletecomment/:commentId", UserAuth, async (req, res) => {
		const { commentId } = req.params;
		const response = await service.deleteComment(commentId);
		return res.json(response);
	});

	router.post("/reportposts", UserAuth, async (req, res) => {
		try {
			const { postId, username, reason } = req.body;
			const reportedpost = await service.ReportPost({ postId, username, reason });
			return res.json(reportedpost);
		} catch (error) {}
	});

	router.post("/commentreply", UserAuth, async (req, res) => {
		try {
			console.log(req.body);
			const { username, replyText, commentId } = req.body;
			const resp = await service.AddCommentReply({ username, replyText, commentId });
			return res.json(resp);
		} catch (error) {}
	});

	router.get("/getusers/:postId", UserAuth, async (req, res) => {
		try {
			const { postId } = req.params;
			const user = await service.FetchUserFromPosts(postId);
			return res.json(user);
		} catch (error) {
			console.log(error);
		}
	});

	router.get("/getposts/:postIds", UserAuth, async (req, res) => {
		try {
			const postIds = req.params.postIds.split(",");
			const user = await service.repositary.FetchSavedPosts(postIds);
			return res.json(user);
		} catch (error) {
			console.log(error);
		}
	});
	app.use("/posts", router);
};
