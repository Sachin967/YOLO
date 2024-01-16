import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Modal,
	ModalContent,
	ModalOverlay,
	useDisclosure
} from "@chakra-ui/react";
import { modalTheme } from "../../config/ChakraModalconfig";
import { useSelector } from "react-redux";
import React from "react";
import { posts } from "../../config/axios";
import useCustomToast from "../../config/toast";

export const CommentDeleteModal = ({ comment, onClose, isOpen, containsPostId, commentId, comments, setComment }) => {
	const { userdetails } = useSelector((state) => state.auth);
	const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
	// const isCurrent = comment.username === userdetails.username;
	return (
		<>
			<Modal theme={modalTheme} onClick={onClose} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				{console.log(comments)}
				<ModalContent
					style={{
						position: "absolute",
						top: "30%",
						left: "35%",
						transform: "translate(-50%, 50%)",
						backgroundColor: "#262626"
					}}>
					{containsPostId ? (
						<>
							<button
								onClick={() => {
									onAlertOpen();
									onClose();
								}}
								className="hover:bg-slate-50 hover:rounded-full hover:text-black text-black dark:text-white">
								Delete
							</button>
							<button
								onClick={onClose}
								className="hover:bg-slate-50 hover:rounded-full hover:text-black text-black dark:text-white">
								Cancel
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => {
									onReportOpen();
									onClose();
								}}
									className="hover:bg-zinc-700 dark:text-white text-black text-lg hover:rounded-xl">
								Report
							</button>
								<button onClick={onClose} className="hover:bg-zinc-700 dark:text-white text-black text-lg hover:rounded-xl">
								Cancel
							</button>
							{/* <button className=""></button>  */}
						</>
					)}
				</ModalContent>
			</Modal>
			<DeleteAlert
				comments={comments}
				setComment={setComment}
				commentId={commentId}
				onAlertClose={onAlertClose}
				isAlertOpen={isAlertOpen}
			/>
		</>
	);
};

export const DeleteAlert = ({ onAlertClose, isAlertOpen, commentId, comments, setComment }) => {
	const cancelRef = React.useRef();
	const showToast = useCustomToast();
	// const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
	const deleteComment = () => {
		try {
			posts
				.delete(`/deletecomment/${commentId}`)
				.then((res) => {
					console.log(res);
					if (res.data) {
						console.log(res.data);
						onAlertClose();
						setComment((prevComment) => prevComment.filter((com) => com._id !== commentId));
						showToast("success", res.data.status);
						// location.reload();
					}
				})
				.catch((error) => {
					if (error.response.status === 403) {
						// Handle 403 Forbidden error
						Error403(error, showToast, dispatch, Navigate);
					} else {
						console.error("Error:", error);
					}
				});
		} catch (error) {}
	};

	return (
		<AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose}>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Delete Comment
					</AlertDialogHeader>

					<AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onAlertClose}>
							Cancel
						</Button>
						<Button colorScheme="red" onClick={deleteComment} ml={3}>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};
