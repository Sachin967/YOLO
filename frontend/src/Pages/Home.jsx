import PostView from "../Components/PostView";
import { useEffect, useState } from "react";
import { posts } from "../config/axios";
import useCustomToast from "../toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Error403 } from "../Commonfunctions";
import InfiniteScroll from "react-infinite-scroll-component";
const Home = () => {
	const [postsData, setPostsData] = useState([]);
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const [page, setPage] = useState(1);
	useEffect(() => {
		ShowPosts();
	}, []);
	console.log(postsData);
	const ShowPosts = () => {
		posts
			.get(`/seeposts?page=${page}&limit=5`)
			.then((res) => {
				const { posts: fetchedPosts, userData } = res.data;

				// Match user data for each post based on user IDs
				const postsWithUserData = fetchedPosts.map((post) => {
					const userDetail = userData.find((user) => user._id === post.userId);
					return { ...post, userDetails: userDetail };
				});

				setPostsData(postsWithUserData);
			})
			.catch((error) => {
				if (error?.response && error.response.status === 403) {
					// Handle 403 Forbidden error
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};

	const fetchData = () => {
		const nextPage = page + 1;
		posts
			.get(`/seeposts?page=${nextPage}&limit=5`) // Use nextPage here instead of page
			.then((res) => {
				const { posts: fetchedPosts, userData } = res.data;

				const postsWithUserData = fetchedPosts.map((post) => {
					const userDetail = userData.find((user) => user._id === post.userId);
					return { ...post, userDetails: userDetail };
				});

				setPostsData([...postsData, ...postsWithUserData]);
				setPage(nextPage);
			})
			.catch((error) => {
				if (error?.response && error.response.status === 403) {
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};

	return (
		<>
			{postsData.map((post) => (
				<PostView key={post._id} post={post} fetchData={fetchData} ShowPosts={ShowPosts} />
			))}
			<InfiniteScroll
				dataLength={postsData.length} //This is important field to render the next data
				next={fetchData}
				hasMore={true}
				loader={<h4>Loading...</h4>}>
				{/* {items} */}
			</InfiniteScroll>
		</>
	);
};
export default Home;
