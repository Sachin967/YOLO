import { upload } from "../config/fileupload-s3.js";
import { NOTIFICATION_BINDING_KEY, USER_BINDING_KEY } from "../config/index.js";
import PostService from "../services/post-service.js";
import { PublishMessage, RPCObserver } from "../utils/index.js";
import { UserAuth } from "./middleware/auth.js";
// import { UserAuth } from "./middleware/auth.js";
export const posts = (app, channel) => {
	const service = new PostService();
	RPCObserver("POST_RPC", service);

	app.post("/addpost", upload.single('media'), async (req, res, next) => {
		console.log(req.file)
		const media = req.file.location
		const { userId, location, privacy, textmedia } = req.body;
		try {
			const response = await service.AddPost({ userId, location, textmedia, privacy, media });
			return res.json(response);
		} catch (error) {
			console.log(error);
		}
	});
	app.get("/seeposts", UserAuth, async (req, res, next) => {
		try {
			const { page, limit } = req.query;
			const response = await service.ShowPosts({ page, limit });
			return res.json(response);
		} catch (error) {
			console.log(error);
		}
	});
	app.post("/likepost", UserAuth, async (req, res, next) => {
		try {
			console.log(req.body);
			const { userId, postId } = req.body;
			const { resp, payload } = await service.LikePost(userId, postId);
			if (payload && Object.keys(payload).length !== 0) {
				PublishMessage(channel, NOTIFICATION_BINDING_KEY, JSON.stringify(payload));
			}
			return res.json(resp);
		} catch (error) {
			console.log(error);
		}
	});

	app.post("/likedPosts", UserAuth, async (req, res) => {
		try {
			const { userId } = req.body;
			const likedPosts = await service.FetchLikedPost(userId);
			res.status(200).json({ success: true, likedPosts });
		} catch (error) {
			res.status(500).json({ error: "Could not fetch liked posts" });
		}
	});
	app.post("/addcomment", UserAuth, async (req, res) => {
		try {
			const { content, username, postId } = req.body;
			const userId = req.user._id;
			const { payload, reply } = await service.AddComment({ content, username, postId }, userId);
			if (payload && Object.keys(payload).length !== 0) {
				PublishMessage(channel, NOTIFICATION_BINDING_KEY, JSON.stringify(payload));
			}
			return res.json({ status: true, reply });
		} catch (error) { }
	});
	app.get("/fetchUserPosts/:id", UserAuth, async (req, res) => {
		try {
			const { id } = req.params;
			const posts = await service.FetchPostsofUser(id);
			return res.json(posts);
		} catch (error) { }
	});
	app.post("/postdetails", UserAuth, async (req, res) => {
		try {
			const { postId } = req.body;
			const response = await service.FetchPostDetail(postId);
			const user = await service.FetchUserFromPosts(postId)
			res.json({ status: true, response, user });
		} catch (error) { }
	});

	app.put("/editpost/:postId", UserAuth, async (req, res) => {
		try {
			const { postId } = req.params;
			const { textmedia, location } = req.body.specificPost;
			const editedPost = await service.EditPost({ postId, textmedia, location });
			return res.json(editedPost);
		} catch (error) {
			console.log(error);
		}
	});

	app.delete("/deletepost/:postId", UserAuth, async (req, res) => {
		const { postId } = req.params;
		const response = await service.deletePost(postId);
		return res.json(response);
	});

	app.delete("/deletecomment/:commentId", UserAuth, async (req, res) => {
		console.log(req.params)
		const { commentId } = req.params;
		const response = await service.deleteComment(commentId);
		return res.json(response);
	});

	app.post("/reportposts", UserAuth, async (req, res) => {
		try {
			const { postId, username, reason } = req.body;
			const reportedpost = await service.ReportPost({ postId, username, reason });
			return res.json(reportedpost);
		} catch (error) { }
	});

	app.post("/commentreply", UserAuth, async (req, res) => {
		try {
			const { username, replyText, commentId } = req.body;
			const resp = await service.AddCommentReply({ username, replyText, commentId });
			return res.json(resp);
		} catch (error) { }
	});

	app.get('/getusers/:postId', async (req, res) => {
		try {
			console.log(req.params)
			const { postId } = req.params
			const user = await service.FetchUserFromPosts(postId)
			return res.json(user)
		} catch (error) {
			console.log(error)
		}
	})
};
