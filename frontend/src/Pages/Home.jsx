import PostView from "../Components/PostView";
import { useEffect, useState } from "react";
import { posts, users } from "../config/axios";
import useCustomToast from "../config/toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Error403 } from "../Commonfunctions";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from 'primereact/skeleton';
import Suggesions from "../Components/Suggesions";
const Home = () => {
	const [loading, setLoading] = useState(true)
	const [postsData, setPostsData] = useState([]);
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [notfollowers, setNotfollowers] = useState([])
	const { userdetails } = useSelector((state) => state.auth);
	const NotFollowers = () => {
		users.get(`/notfollowers/${userdetails._id}`).then(res => {
			if (res.data) {
				setNotfollowers(res.data)
			}
		}).catch(err => console.log(err))
	}

	useEffect(() => {
		ShowPosts();
		NotFollowers()
	}, []);
	console.log(postsData);
	const ShowPosts = () => {
		setLoading(false)
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
			<div className="dark:bg-black bg-white max-h-full min-h-screen">
				{loading && <span className="loaders"></span>}
				<div className="flex h-full">
					<div className="ml-[70px] w-[380px] border-r md:w-[1110px] lg:w-[750px] sm:w-[980px] lg:ml-[320px] sm:ml-[55px] dark:bg-black bg-white">
						{postsData.map((post) => (
							<PostView post={post} fetchData={fetchData} ShowPosts={ShowPosts} />
						))}
					</div>
					<Suggesions notfollowers={notfollowers} />
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
