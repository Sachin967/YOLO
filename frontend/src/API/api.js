import { Error403 } from "../Commonfunctions";
import { posts, users } from "../config/axios";

export const SavePost = async ({ postId, id }) => {
	return users
		.post(`/savepost`, { userId: id, postId: postId })
		.then((res) => {
			console.log(res)
			if (res.data.status === "saved") {
				// setSavePost(true);
				return true
			} else if (res.data.status === "removed") {
				// setSavePost(false);
				return false
			}
		})	
		.catch((err) => console.log(err));
};

export const fetchSavedPost = async (setSavedPost, id) => {
	users
		.get(`/savedpost/${id}`)
		.then((res) => {
			if (res.data) {
				console.log(res.data);
				const { users, response } = res.data;
				const postsWithUserData = response.map((post) => {
					const userDetail = users.find((user) => {
						return user._id === post.userId;
					});
					return { ...post, userDetail };
				});
				setSavedPost(postsWithUserData);

			}
		})
		.catch((err) => console.log(err));
};

export const handleLike = async (id, _id, setLikeCount, setLiked, fetchLikedPost, showToast, dispatch, Navigate) => {
	if (id) {
		posts
			.post("/likepost", { userId: id, postId: _id })
			.then((res) => {
				if (res.data.status === "liked") {
					setLikeCount(res.data.likeCount);
					setLiked(true); // Set liked state to true
					fetchLikedPost(id,_id,setLiked);
				} else if (res.data.status === "unliked") {
					setTimeout(() => {
						setLikeCount(res.data.likeCount);
						setLiked(false);
					}, 150);
					fetchLikedPost(id,_id,setLiked);
				}
			})
			.catch((error) => {
				if (error.response.status === 403) {
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
			if (error.response.status === 403) {
				// Handle 403 Forbidden error
				Error403(error, showToast, dispatch, Navigate);
			} else {
				console.error("Error:", error);
			}
		});
};