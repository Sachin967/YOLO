import { Avatar, Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { users } from "../config/axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CommentModal from "../Components/Modals/CommentModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ImBookmark } from "react-icons/im";
import { GrBookmark } from "react-icons/gr";
import { SavePost, fetchSavedPost } from "../API/api";
import { ChatState } from "../Context/ChatProvider";
const Bookmark = () => {
	const [saved, setSaved] = useState(false);
	const { savedpost, setSavedPost } = ChatState();
	useEffect(() => {
		fetchSavedPost(setSavedPost, userdetails._id);
	}, []);
	const { userdetails } = useSelector((state) => state.auth);
	const id = userdetails._id;
	const PostSave = async (postId) => {
		try {
			const fetchedPosts = await SavePost({ postId, id });
			setSaved(fetchedPosts);
			fetchSavedPost(setSavedPost, userdetails._id);
		} catch (error) {
			console.log(error);
		}
	};
	// const fetchSavedPost = () => {
	// 	users
	// 		.get(`/savedpost/${userdetails._id}`)
	// 		.then((res) => {
	// 			if (res.data) {
	// 				console.log(res.data);
	// 				const { users, response } = res.data;
	// 				const postsWithUserData = response.map((post) => {
	// 					const userDetail = users.find((user) => {
	// 					return	user._id === post.userId;
	// 					});
	// 					return { ...post, userDetail };
	// 				});
	// 				setSavedPost(postsWithUserData);
	// 			}
	// 		})
	// 		.catch((err) => console.log(err));
	// };
	return (
		<div className="flex min-h-full">
			<div className="ml-12 w-[694px] md:w-[1110px] lg:w-[750px] min-h-screen max-h-full sm:w-[980px] lg:ml-[320px] sm:ml-[55px] bg-black">
				<h2 className="text-center text-white text-xl font-semibold">Saved Posts</h2>
				{/* <h2>Saved Posts</h2> */}

				<div className="p-4 border-r border-b border-gray-700  dark:border-gray-700 max-w-[750px] ">
					{savedpost?.map((post) => (
						<div className=" max-h-full pt-5 pb-11 bg-black dark:bg-gray-900 border-b border-gray-500">
							<Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
								<a href={`/${post.userDetail.username}`}>
									{" "}
									<Avatar
										src={post?.userDetail?.propic?.url}
										name="Segun Adebayo"
										className="mb-[610px]"
									/>
								</a>
								<Box>
									<a href={`/${post.userDetail.username}`}>
										<Heading className="text-white" size="sm">
											{post?.userDetail?.name}
										</Heading>
									</a>
									<a href={`/${post.userDetail.username}`}>
										<a className="text-gray-500">@{post.userDetail.username}</a>
									</a>
									<Text className="text-white mt-5">{post?.textmedia}</Text>
									{post?.media && (
										<Image
											// onClick={handleClick}
											className="rounded-3xl w-[550px] h-[550px]"
											objectFit="cover"
											src={post?.media?.url}
											alt="Chakra UI"
										/>
									)}
								</Box>
								<div onClick={() => PostSave(post?._id)} className="inline-block">
									<ImBookmark className="cursor-pointer scale-105 h-14 w-14 p-3 transition-transform text-blue-500" />
								</div>
							</Flex>
						</div>
					))}
					{savedpost.length < 1 && (
						<>
							<div className="m-48 min-h-screen">
								<h1 className="text-center text-4xl font-semibold text-white">Save posts for later </h1>
								<p className="text-center text-xl p-5  font-thin text-white">
									Bookmark posts to easily find them again in the future.
								</p>
							</div>
						</>
					)}
				</div>
			</div>
			<div className="w-[370px] border-l border-gray-700 bg-black"></div>
		</div>
	);
};
export default Bookmark;
