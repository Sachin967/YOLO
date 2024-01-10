import { useEffect, useState } from "react";
// import PostTable from "../AdminComponents/PostTable";
import { admin } from "../config/axios";
import PostDetailModal from "../AdminComponents/PostDetailModal";
import { useDisclosure } from "@chakra-ui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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

	const imageBodyTemplate = (post) => {
		return (
			<img
				src={
					post?.media ||
					"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
				}
				alt={"No Image"}
				className="w-12 rounded-full shadow-2 border-round"
			/>
		);
	};
	const actionTem = (post) => {
		return (
			<>
				<button onClick={onOpen} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
					More details
				</button>
				<PostDetailModal post={post} isOpen={isOpen} onClose={onClose} />
			</>
		);
	};

	const ShowReportLength = (post) => {
		return <h1 className="text-black text-start"> {post?.reported?.length}</h1>;
	};
	return (
		<>
			<div className="card bg-white">
				<h1 className="text-center text-black font-bold text-3xl py-3">Post List</h1>
				<div className="flex h-screen">
					<DataTable
						className="w-[79rem] overflow-hidden rounded-3xl mx-auto"
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10, 25, 50]}
						value={posts}
						tableStyle={{ minWidth: "50rem" }}>
						<Column
							className="border-b border-l text-white"
							header="Post"
							body={imageBodyTemplate}></Column>
						<Column className="border-b" field="name" header="Name"></Column>
						<Column className="border-b" field="createdAt" header="Created At"></Column>
						<Column className="border-b" body={ShowReportLength} header="Reports"></Column>
						<Column className="border-b " header="Action" body={actionTem}></Column>
					</DataTable>
				</div>
			</div>
		</>
	);
};
export default PostList;
