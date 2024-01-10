import {
	Button,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from "@chakra-ui/react";
import { admin } from "../config/axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";

const PostDetailModal = ({ post, isOpen, onClose }) => {
	const [postData, setPostData] = useState(post);
	const handlePostblock = async () => {
		try {
			if (postData.isListed) {
				admin.post("/unlistpost", { postId: postData._id }).then((res) => {
					if (res.data) {
						setPostData((prevData) => ({
							...prevData,
							isListed: false
						}));
					}
				});
			} else {
				admin.post("/listpost", { postId: postData._id }).then((res) => {
					if (res.data) {
						setPostData((prevData) => ({
							...prevData,
							isListed: true
						}));
					}
				});
			}
		} catch (err) {
			console.log("Error occurred:", err);
			// Handle network or server errors
			// Show error message using toast or handle it as required
		}
	};

	return (
		<div>
			<Modal variant="" motionPreset="scale" className="" onClose={onClose} size="full" isOpen={isOpen}>
				<ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
				<ModalContent style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}>
					<ModalHeader bg="black" className="px-0 bg-transparent py-0">
						<ModalCloseButton className="hover:text-white" />
					</ModalHeader>
					<ModalBody bg={"black"} className="flex  bg-transparent justify-center relative">
						<div>
							<img className="w-[500px] mr-[650px]  h-[625px]" src={postData?.media} alt="" />
							{/* <button className="w-[500px] h-16 bg-green-900 ">Unlist</button> */}
							<button
								className={`w-[500px] h-16 text-white text-xl font-bold ${
									postData?.isListed ? "bg-purple-500" : "bg-purple-600"
								}`}
								onClick={handlePostblock}>
								{postData.isListed ? "Unlist" : "List"}
							</button>
						</div>
						<div className="absolute flex top-5 right-40 text-white border-t border-l border-zinc-700  overflow-y-scroll max-h-[535px]">
							<div className="card">
								<DataTable value={postData?.reported} tableStyle={{ minWidth: "35rem" }}>
									<Column
										className="border-r bg-zinc-400"
										field="reporter"
										header="Reported(Username)"></Column>
									<Column className="border-r bg-zinc-400" field="reason" header="Reason"></Column>
									<Column className=" bg-zinc-400" field="createdAt" header="Reported On"></Column>
								</DataTable>
							</div>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
		// <Modal onClose={onClose} size="full" isOpen={isOpen}>
		// 	<ModalOverlay />
		// 	<ModalContent>
		// 		<ModalHeader className="text-center text-white">Modal Title</ModalHeader>
		// 		<ModalCloseButton />
		// 		<ModalBody className="p-4">
		// 			<div className="flex justify-center">
		// 				<img src={post?.media?.url} alt="" className="w-80 h-80 mb-4" />
		// 			</div>
		// 			<div className="flex justify-between text-gray-500 mb-4">
		// 				<h2>
		// 					PostId: <span className="text-white">{post?._id}</span>{" "}
		// 				</h2>
		// 				<h2>
		// 					UserId: <span className="text-white">{post?.userId}</span>
		// 				</h2>
		// 				<h2>
		// 					No of Reports: <span className="text-white">{post?.reported?.length}</span>
		// 				</h2>
		// 			</div>
		// 			{post?.reported.map((reports, index) => (
		// 				<div className="flex text-gray-500" key={index}>
		// 					<ul className="me-10">
		// 						Reported by
		// 						<li>
		// 							<span className="text-white">{reports.reporter}</span>
		// 						</li>
		// 					</ul>
		// 					<ul>
		// 						Reason
		// 						<li>
		// 							<span className="text-white">{reports?.reason}</span>
		// 						</li>
		// 					</ul>
		// 				</div>
		// 			))}
		// 		</ModalBody>

		// 		<ModalFooter>
		// 			<button className="text-gray-400 hover:text-white p-2">List</button>
		// 			{/* <Button onClick={onClose}>Close</Button> */}
		// 		</ModalFooter>
		// 	</ModalContent>
		// </Modal>
	);
};
export default PostDetailModal;
