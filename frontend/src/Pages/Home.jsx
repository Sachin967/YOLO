import PostView from "../Components/PostView";
import { useEffect, useState } from "react";
import { posts, users } from "../config/axios";
import useCustomToast from "../config/toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Error403 } from "../Commonfunctions";
import InfiniteScroll from "react-infinite-scroll-component";
import Suggesions from "../Components/Suggesions";
const Home = () => {
	const [loading, setLoading] = useState(true);
	const [postsData, setPostsData] = useState([]);
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const [page, setPage] = useState(1);

	useEffect(() => {
		setTimeout(() => {
			ShowPosts();
		}, 100);
	}, []);

	const ShowPosts = async () => {
		try {
			const response = await posts.get(`/seeposts?page=${page}&limit=5`);
			if (response) {
				setLoading(false);
			}
			const { posts: fetchedPosts } = response.data;
			const userIds = fetchedPosts.map((post) => post.userId);
			const str = userIds.join(",");
			const usrs = await users.get(`/getusers/${str}`);
			const userData = usrs.data;
			// Match user data for each post based on user IDs
			const postsWithUserData = fetchedPosts.map((post) => {
				const userDetail = userData.find((user) => user._id === post.userId);
				return { ...post, userDetails: userDetail };
			});
			setPostsData(postsWithUserData);
		} catch (error) {
			if (error?.response && error.response.status === 403) {
				// Handle 403 Forbidden error
				Error403(error, showToast, dispatch, Navigate);
			} else {
				console.error("Error:", error);
			}
		}
	};

	const fetchData = async () => {
		const nextPage = page + 1;
		try {
			const response = await posts.get(`/seeposts?page=${nextPage}&limit=5`);
			const { posts: fetchedPosts } = response.data;
			const userIds = fetchedPosts.map((post) => post.userId);
			const str = userIds.join(",");
			const usrs = await users.get(`/getusers/${str}`);
			const userData = usrs.data;
			const postsWithUserData = fetchedPosts.map((post) => {
				const userDetail = userData.find((user) => user._id === post.userId);
				return { ...post, userDetails: userDetail };
			});
			setPostsData([...postsData, ...postsWithUserData]);
			setPage(nextPage);
		} catch (error) {
			if (error?.response && error.response.status === 403) {
				Error403(error, showToast, dispatch, Navigate);
			} else {
				console.error("Error:", error);
			}
		}
	};

	return (
		<>
			<div className="dark:bg-black bg-white max-h-full min-h-screen">
				{loading && <span className="loaders"></span>}
				<div className="flex h-full">
					<div className="ml-[70px] w-[380px]  md:w-[1110px] lg:w-[750px] sm:w-[980px] lg:ml-[320px] sm:ml-[55px] dark:bg-black bg-white">
						{postsData.map((post) => (
							<PostView post={post} fetchData={fetchData} ShowPosts={ShowPosts} />
						))}
					</div>
					<Suggesions />
				</div>
				<InfiniteScroll
					dataLength={postsData.length} // This is important field to render the next data
					next={fetchData}
					hasMore={true}
					loader={<h4>Loading...</h4>}
				/>
			</div>
		</>
	);
};
export default Home;
