import { Avatar, Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { users } from "../config/axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CommentModal from "../Components/Modals/CommentModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ImBookmark } from "react-icons/im";
import { GrBookmark } from "react-icons/gr";
import { NotFollowers, SavePost, fetchSavedPost } from "../API/api";
import { ChatState } from "../Context/ChatProvider";
import { Link } from "react-router-dom";
import Suggesions from "../Components/Suggesions";
const Bookmark = () => {
	const [saved, setSaved] = useState(false);
	const { savedpost, setSavedPost, notfollowers, setNotfollowers } = ChatState();
	const { userdetails } = useSelector((state) => state.auth);
	useEffect(() => {
		fetchSavedPost(setSavedPost, userdetails._id);
		NotFollowers(userdetails._id, setNotfollowers);
	}, []);
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

	return (
		<div className="flex justify-end h-full">
			<div className="ml-12 w-[694px] md:w-[1110px] lg:w-[750px] min-h-screen max-h-full sm:w-[980px]  sm:ml-[55px] bg-white dark:bg-black">
				<h2 className="text-center dark:text-white text-black text-3xl font-bold">Saved Posts</h2>

				<div className="p-4  border-b border-gray-700  dark:border-gray-700 max-w-[750px] ">
					{savedpost?.map((post) => (
						<div className="pt-5 pb-11  dark:bg-black bg-white  border-b border-gray-500">
							<div className="flex justify-between items-start px-32">
								<div className="flex justify-start">
									<Link to={`/${post.userDetail.username}`}>
										{" "}
										<Avatar src={post?.userDetail?.propic?.url} name="Segun Adebayo" className="" />
									</Link>

									<Link className="pl-5" to={`/${post.userDetail.username}`}>
										<Heading className="dark:text-white text-black mb-2" size="sm">
											{post?.userDetail?.name}
										</Heading>
										<a className="text-gray-500">@{post.userDetail.username}</a>
									</Link>
								</div>

								<div onClick={() => PostSave(post?._id)}>
									<ImBookmark className="cursor-pointer scale-105 h-14 w-14 p-3 transition-transform text-blue-500" />
								</div>
								{/* <Link to={`/${post.userDetail.username}`}>
									
								</Link> */}
							</div>
							<Text className="dark:text-white px-32 text-black mt-2">{post?.textmedia}</Text>
							<Flex className="flex justify-center pt-5">
								{post?.media && (
									<Image
										// onClick={handleClick}
										className="rounded-3xl w-[480px] h-[600px]"
										objectFit="cover"
										src={post?.media}
										alt="Chakra UI"
									/>
								)}
							</Flex>
						</div>
					))}
					{savedpost.length < 1 && (
						<>
							<div className="m-48 min-h-screen">
								<h1 className="text-center text-4xl font-semibold dark:text-white text-black">
									Save posts for later{" "}
								</h1>
								<p className="text-center text-xl p-5  font-thin dark:text-white text-black">
									Bookmark posts to easily find them again in the future.
								</p>
							</div>
						</>
					)}
				</div>
			</div>
			<Suggesions notfollowers={notfollowers} />
		</div>
	);
};
export default Bookmark;
