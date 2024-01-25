import { Error403 } from "../../Commonfunctions";
import { posts } from "../../config/axios";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Avatar,
	Heading,
	Text
} from "@chakra-ui/react";
import { modalTheme } from "../../config/ChakraModalconfig";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCustomToast from "../../config/toast";
import { useNavigate } from "react-router-dom";
const CommentModal = ({ onCloseCommentModal, isCommentModalOpen, PostUserdetails, post, ShowPosts, fetchData }) => {
	const { userdetails } = useSelector((state) => state.auth);
	const usrname = userdetails.username;
	const [text, setText] = useState("");
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const handlePost = (Id) => {
		const data = {
			content: text,
			username: usrname,
			postId: Id
		};
		posts
			.post("/addcomment", data)
			.then((res) => {
				console.log(res);
				if (res.data.status) {
					showToast("success", "Comment added");
					onCloseCommentModal();
					// FetchLikedPost()
					ShowPosts();
					fetchData();
				}
			})
			.catch((error) => {
				if (error.response && error.response.status === 403) {
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};
	return (
		<Modal onClose={onCloseCommentModal} size={"xl"} isOpen={isCommentModalOpen} theme={modalTheme}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader className="flex flex-col">
					<div className="flex items-center">
						<Avatar name="Segun Adebayo" className="mb-10" src={PostUserdetails?.propic} />
						<div className="flex flex-col ml-2">
							<Heading className="text-white " size="sm">
								{PostUserdetails?.name}
							</Heading>
							<Text className="text-gray-500">@{PostUserdetails?.username}</Text>
							<Text className="dark:text-white text-black">{post?.textmedia}</Text>
						</div>
					</div>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<textarea
						className="bg-transparent w-full border-none mb-4 rounded-2xl text-white resize-y overflow-hidden focus:outline-none"
						placeholder="Post your reply"
						onChange={(e) => setText(e.target.value)}
						type="text"
						value={text}
					/>
				</ModalBody>
				<ModalFooter>
					<Button onClick={() => handlePost(post?._id)}>Post</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default CommentModal;
