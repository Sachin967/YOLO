import { Button, Modal, FileInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceLaughSquint } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { posts } from "../../config/axios.js";
import { Avatar } from "@chakra-ui/react";
import useCustomToast from "../../toast.js";
import React, { useRef } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";
// import { text } from "@fortawesome/fontawesome-svg-core";
// const [croppedImage, setCroppedImage] = useState(null);
// const handleFileChange = (e) => {
// 	const file = e.target.files[0];
// 	if (file) {
// 		setFileToBase(file);
// 	}
// };
// const setFileToBase = (file) => {
// 	const reader = new FileReader();
// 	reader.readAsDataURL(file);
// 	reader.onloadend = () => {
// 		setSelectedImage(reader.result);
// 	};
// };
function PostModal({ isOpen, onClose }) {
	const imageRef = useRef(null);
	let cropper;
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const [modalHeight, setModalHeight] = useState("auto");
	const [text, setText] = useState("");
	const [emojishow, setEmojishow] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const { userdetails } = useSelector((state) => state.auth);
	const id = userdetails._id;
	const openEmoji = () => {
		setEmojishow((prevEmojiShow) => !prevEmojiShow);
	};
	const [loading, setLoading] = useState(false);
	const addEmoji = (selectedEmoji) => {
		setText((prevText) => prevText + selectedEmoji.emoji);
	};

	useEffect(() => {
		if (selectedImage) {
			setModalHeight("calc(100vh)"); // Adjust according to your header/footer height
		} else {
			setModalHeight("auto");
		}
	}, [selectedImage]);

	const handlePost = (e) => {
		e.preventDefault();
		setLoading(true);

		const byteCharacters = atob(selectedImage.split(",")[1]);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: "image/jpeg" }); // Adjust the type based on your image format

		// Create a File from the Blob
		const file = new File([blob], "cropped_image.jpeg", { type: "image/jpeg" }); // Adjust the name and type
		const formData = new FormData();
		formData.append("textmedia", text);
		formData.append("userId", id);
		formData.append("media", file);
		posts
			.post("/addpost", formData)
			.then((res) => {
				console.log(res);
				if (res.data.data.status) {
					console.log(res.data.data.message);
					setLoading(false);
					showToast("success", "Post added");
					onClose();
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
	};

	// const onSelectFile = (e) => {
	// 	 const file = e.target.files[0];
	// 		const imageURL = URL.createObjectURL(file);

	// 		imageRef.current.src=imageURL
	// 		const image = new Image();
	// 		image.src = imageRef;

	// 		image.onload = () => {
	// 			 cropper = new Cropper(imageRef, {
	// 				aspectRatio: 4 / 5
	// 				// Other configuration options
	// 			});

	// 			const croppedCanvas = cropper.getCroppedCanvas();
	// 			const croppedImage = croppedCanvas.toDataURL("image/jpeg");

	// 			setSelectedImage(croppedImage);

	// 			URL.revokeObjectURL(imageURL); // Clean up the object URL
	// 		};
	// };
	// const onSelectFile = (e) => {
	// 	const file = e.target.files[0];
	// 	const imageURL = URL.createObjectURL(file);

	// 	const image = new Image();
	// 	image.onload = () => {
	// 		imageRef.current.src = imageURL; // Setting the source for the displayed image

	// 		const cropper = new Cropper(imageRef.current, {
	// 			aspectRatio: 4 / 5,
	// 			// Other configuration options
	// 			ready() {
	// 				const croppedCanvas = cropper.getCroppedCanvas();
	// 				if (croppedCanvas) {
	// 					const croppedImage = croppedCanvas.toDataURL("image/jpeg");
	// 					setSelectedImage(croppedImage);
	// 				} else {
	// 					console.error("Failed to get cropped canvas.");
	// 				}
	// 			}
	// 		});

	// 		URL.revokeObjectURL(imageURL); // Clean up the object URL
	// 	};

	// 	image.src = imageURL;
	// };

	const onSelectFile = (e) => {
		const file = e.target.files[0];
		const imageURL = URL.createObjectURL(file);

		const image = new Image();
		image.onload = () => {
			imageRef.current.src = imageURL; // Setting the source for the displayed image

			const cropper = new Cropper(imageRef.current, {
				aspectRatio: 4 / 5,
				// Other configuration options
				crop() {
					const croppedCanvas = cropper.getCroppedCanvas();
					if (croppedCanvas) {
						const newCroppedImage = croppedCanvas.toDataURL("image/jpeg");
						setSelectedImage(newCroppedImage);
					} else {
						console.error("Failed to get cropped canvas.");
					}
				}
			});

			URL.revokeObjectURL(imageURL); // Clean up the object URL
		};

		image.src = imageURL;
	};

	return (
		<>
			<Modal
				onClick={onClose}
				className="bg-gray-700 text-white dark"
				style={{ height: modalHeight, width: "screen" }}
				show={isOpen}
				position="top-center"
				onClose={onClose}>
				<div className="" onClick={(e) => e.stopPropagation()}>
					<Modal.Header className=" bg-black border-0">Create new post</Modal.Header>
					{loading && (
						<div
							role="status"
							className="absolute z-10 w-full h-full bg-black opacity-50 flex justify-center items-center">
							<svg
								aria-hidden="true"
								className="inline w-28 h-28 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					)}
					<form onSubmit={handlePost}>
						<Modal.Body className="bg-black">
							<div className="relative mb-5 flex items-center max-w-full">
								<Avatar size={"sm"} src="https://bit.ly/dan-abramov" />
								<textarea
									name="textmedia"
									value={text}
									onChange={(e) => setText(e.target.value)}
									id="large-input"
									className="block w-full ms-5 p-4 text-gray-900 rounded-lg bg-black sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y overflow-auto border-none"
									rows="3"
									placeholder="Enter your text here..."></textarea>
							</div>
							<div className="w-1/2 h-auto mx-auto p-4">
								<img ref={imageRef} alt="Crop" className="max-w-full" />
							</div>
							<div className="w-1/2 mx-auto">
								{selectedImage && (
									<div>
										<img src={selectedImage} alt="Cropped" className="max-w-full" />
									</div>
								)}
							</div>
						</Modal.Body>
						<Modal.Footer className="flex justify-around items-center bg-black border-0">
							<FontAwesomeIcon
								icon={faFaceLaughSquint}
								onClick={openEmoji}
								style={{ color: "#ffffff" }}
							/>
							<label for="file-upload" className="mr-3">
								<svg
									class="w-[25px] h-[25px] text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="20"
									fill="none"
									viewBox="0 0 16 20">
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.4"
										d="M6 1v4a1 1 0 0 1-1 1H1m8.484 7.984 2.152 2.152M15 2v16a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2Zm-4.636 9.864a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
									/>
								</svg>
							</label>
							<input
								id="file-upload"
								type="file"
								accept="image/*, video/*"
								className="hidden"
								multiple
								onChange={onSelectFile}
								name="media"
							/>

							<Button type="submit">Post</Button>
						</Modal.Footer>
					</form>
				</div>
				{emojishow && (
					<div
						className="fixed transform -translate-x-1/2 -translate-y-1/2 z-50"
						style={{ top: selectedImage ? "430px" : "550px", left: "550px" }}>
						<EmojiPicker onEmojiClick={addEmoji} />
					</div>
				)}
			</Modal>
		</>
	);
}

export default PostModal;
