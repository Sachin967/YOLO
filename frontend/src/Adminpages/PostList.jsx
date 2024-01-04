import { useEffect, useState } from "react";
// import PostTable from "../AdminComponents/PostTable";
import { admin } from "../config/axios";
import PostDetailModal from "../AdminComponents/PostDetailModal";
import { useDisclosure } from "@chakra-ui/react";

const PostList = () => {
	const [posts, setPosts] = useState([]);
	  const { isOpen, onOpen, onClose } = useDisclosure();

	async function getPostsFromBackend() {
		try {
			const response = await admin.get("/getposts");
			if (response) {
				setPosts(response.data);
			}
		} catch (error) {
			console.error(error);
		}
	}

	// Trigger the getPostsFromBackend function in a useEffect hook
	useEffect(() => {
		getPostsFromBackend();
	}, []);

	return (
		<>
		{console.log(posts)}
			{/* <PostTable posts={posts} /> */}
			{posts.map((post, index) => (
				<div className="relative overflow-x-auto shadow-md p-10 min-h-screen bg-gray-900 sm:rounded-lg">
					<h1 className="text-4xl font-bold p-3 text-white text-center">Post List</h1>
					<table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									Post Id
								</th>
								<th scope="col" className="px-6 py-3">
									User Id
								</th>
								<th scope="col" className="px-6 py-3">
									Media
								</th>
								<th scope="col" className="px-6 py-3">
									Created At
								</th>
								<th scope="col" className="px-6 py-3">
									Reports
								</th>
								<th scope="col" className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>

						<tbody>
							<tr key={index} className="bg-gray-700 border-b dark:bg-gray-800 dark:border-gray-700">
								<th
									scope="row"
									className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									{post._id}
								</th>
								<td className="px-6 py-4">{post?.userId}</td>
								<td className="px-6 py-4">
									{post?.media.url && (
										<img src={post.media.url} alt="Post Image" className="max-w-56 max-h-56" />
									)}
								</td>

								<td className="px-6 py-4">{post?.createdAt}</td>
								<td className="px-6 py-4">{post?.reported?.length}</td>
								<td className="px-6 py-4">
									<button
										onClick={onOpen}
										className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
										More details
									</button>
								</td>
							</tr>
						</tbody>
					</table>
					<PostDetailModal post={post} isOpen={isOpen} onClose={onClose} />
				</div>
			))}
		</>
	);
};
export default PostList;
