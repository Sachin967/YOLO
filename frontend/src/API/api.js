import { useNavigate } from "react-router-dom";
import { Error403 } from "../Commonfunctions";
import { posts, users } from "../config/axios";
import { useDispatch } from "react-redux";
import { AuthActions } from "../store/Authslice";

export const SavePost = async ({ postId, id }) => {
	return users
		.post(`/savepost`, { userId: id, postId: postId })
		.then((res) => {
			if (res.data.status === "saved") {
				// setSavePost(true);
				return true;
			} else if (res.data.status === "removed") {
				// setSavePost(false);
				return false;
			}
		})
		.catch((err) => console.log(err));
};

export const fetchSavedPost = async (setSavedPost, id) => {
	const p = await users.get(`/savedpost/${id}`);
	const postIds = p?.data;
	if (postIds.length > 0) {
		const post = await posts.get(`/getposts/${postIds}`);
		console.log(post?.data);
		const pos = post?.data;
		const userIds = pos.map((po) => {
			return po.userId;
		});
		const str = userIds.join(",");
		const us = await users.get(`/getusers/${str}`);
		const postsWithUserData = pos.map((p) => {
			console.log(p);
			const userDetail = us?.data.find((user) => {
				return user._id === p.userId;
			});
			return { ...p, userDetail };
		});
		setSavedPost(postsWithUserData);
	} else {
		setSavedPost([]);
	}
};

export const handleLike = async (id, _id, setLikeCount, setLiked, fetchLikedPost, showToast, dispatch, Navigate) => {
	if (id) {
		posts
			.post("/likepost", { userId: id, postId: _id })
			.then((res) => {
				if (res.data.status === "liked") {
					setLikeCount(res.data.likeCount);
					setLiked(true); // Set liked state to true
					fetchLikedPost(id, _id, setLiked);
				} else if (res.data.status === "unliked") {
					setTimeout(() => {
						setLikeCount(res.data.likeCount);
						setLiked(false);
					}, 150);
					fetchLikedPost(id, _id, setLiked);
				}
			})
			.catch((error) => {
				if (error.response && error.response.status === 403) {
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	}
};

export const fetchLikedPost = (userId, postId, setLiked) => {
	posts
		.post("/likedPosts", { userId })
		.then((response) => {
			const likes = response.data.likedPosts;
			const isPostLiked = likes.some((likedPost) => likedPost._id === postId);
			setLiked(isPostLiked);
		})
		.catch((error) => {
			if (error.response && error.response.status === 403) {
				// Handle 403 Forbidden error
				Error403(error, showToast, dispatch, Navigate);
			} else {
				console.error("Error:", error);
			}
		});
};

export const handleLogout = (dispatch, Navigate) => {
	users.post("/logout").then((res) => {
		if (res.status) {
			dispatch(AuthActions.UserLogout());
			Navigate("/login");
		}
	});
};

export const NotFollowers = (id, setNotfollowers) => {
	users
		.get(`/notfollowers/${id}`)
		.then((res) => {
			if (res.data) {
				setNotfollowers(res.data);
			}
		})
		.catch((err) => console.log(err));
};
