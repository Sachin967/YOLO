import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { posts, users } from "../../config/axios";
import React, { useEffect, useState } from "react";
import useCustomToast from "../../toast";
import { modalTheme } from "../../config/ChakraModalconfig";
import { reportingReasons } from "../../constants/constant";
import { AuthActions } from "../../store/Authslice";
import { useNavigate } from "react-router-dom";
function OptionsModal({
	isOpen,
	onClose,
	onClosePostModal,
	postId,
	containsPostId,
	specificPost,
	setSpecificPost,
	setPosts,
	username,
	image
}) {
	const { userdetails } = useSelector((state) => state.auth);
	const cancelRef = React.useRef();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const showToast = useCustomToast();
	const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
	const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
	const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();

	const deletePost = () => {
		try {
			posts
				.delete(`/deletepost/${postId}`)
				.then((res) => {
					console.log(res);
					if (res.data) {
						onAlertClose();
						onClosePostModal();
						setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
						showToast("success", res.data);
						location.reload();
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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setSpecificPost((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const EditPost = async () => {
		try {
			posts
				.put(`/editpost/${postId}`, { specificPost })
				.then((res) => {
					console.log(res.data);
					if (res.data) {
						setSpecificPost(res.data);
						onDrawerClose();
						showToast("success", "Post updated");
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
		} catch (error) {
			console.log(error);
		}
	};

	const handleReport = async (reason) => {
		try {
			posts
				.post("/reportposts", { postId, username: userdetails.username, id: userdetails._id, reason })
				.then((res) => {
					if (res.data.message) {
						onReportClose();
						showToast("info", res.data.message);
					} else {
						onReportClose();
						showToast("info", "Post Reported");
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
		<>
			{/* Options Modal */}
			<Modal theme={modalTheme} onClick={onClose} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
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
									onClose();
									onAlertOpen();
								}}
								className="hover:bg-slate-50 hover:rounded-full hover:text-black text-white">
								Delete
							</button>
							<button
								onClick={() => {
									onClose();
									onDrawerOpen();
								}}
								className="hover:bg-slate-50 hover:rounded-full hover:text-black text-white">
								Edit
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => {
									onReportOpen();
									onClose();
								}}
								className="hover:bg-zinc-700 text-white text-lg hover:rounded-xl">
								Report
							</button>
							<button onClick={onClose} className="hover:bg-zinc-700 text-white text-lg hover:rounded-xl">
								Cancel
							</button>
							{/* <button className=""></button>  */}
						</>
					)}
				</ModalContent>
			</Modal>
			{/* Repost Post */}
			<Modal onClose={onReportClose} size={"xs"} isOpen={isReportOpen}>
				<ModalOverlay />
				<ModalContent style={{ backgroundColor: "#262626" }}>
					<ModalHeader className="text-center text-white">Report</ModalHeader>
					<ModalCloseButton className="text-white" />
					<ModalBody>
						<h2 className="text-lg mb-3 font-semibold text-white">Why are you reporting this post?</h2>
						{reportingReasons.map((reason) => (
							<button
								className="text-white block w-full mb-2  px-4 py-2 rounded"
								key={reason.value}
								onClick={() => handleReport(reason.label)}>
								{reason.label}
							</button>
						))}
					</ModalBody>
				</ModalContent>
			</Modal>
			{/* Edit Post */}
			<Drawer onClose={onDrawerClose} isOpen={isDrawerOpen} size={"md"}>
				<DrawerOverlay />
				<DrawerContent style={{ backgroundColor: "#262626" }}>
					<button onClick={EditPost} className="absolute text-blue-700 p-2 top-0 left-0">
						Done
					</button>
					<DrawerCloseButton className="text-white" />
					<DrawerHeader className="text-center text-white">Edit Info</DrawerHeader>
					<DrawerBody>
						<div className="flex mb-10">
							<img className="w-10 h-10 rounded-full mr-3" src={image} alt="" />
							<h1 className="text-lg text-white font-bold">{username}</h1>
						</div>
						<textarea
							onChange={(e) => handleInputChange(e)}
							name="textmedia"
							value={specificPost?.textmedia}
							className="text-white"
							style={{ backgroundColor: "#262626" }}
							id=""
							cols="49"
							rows="4"></textarea>
						<input
							onChange={(e) => handleInputChange(e)}
							name="location"
							value={specificPost?.location}
							type="text"
							style={{ backgroundColor: "#262626" }}
							className="w-full my-7 text-white"
							placeholder="Add Location"
						/>
						<img className="max-w-[400px] mx-auto max-h-[400px] " src={specificPost?.media?.url} alt="" />
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			{/* Delete Post */}
			<AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete Post
						</AlertDialogHeader>

						<AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onAlertClose}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={deletePost} ml={3}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}

export default OptionsModal;
