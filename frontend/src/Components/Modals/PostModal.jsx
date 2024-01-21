import { Button, Modal, FileInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceLaughSquint } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { mapbox, posts } from "../../config/axios.js";
import { Avatar, Box } from "@chakra-ui/react";
import useCustomToast from "../../config/toast.js";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
function PostModal({ isOpen, onClose }) {
	let cropper;
	const cropperRef = useRef(null);
	const [imageUrl, setImageUrl] = useState("");
	const imageRef = useRef(null);
	const inputRef = useRef(null);
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const [modalHeight, setModalHeight] = useState("auto");
	const [text, setText] = useState("");
	const [emojishow, setEmojishow] = useState(false);
	const [selectedImage, setSelectedImage] = useState("");
	const { userdetails } = useSelector((state) => state.auth);
	const [location, setLocation] = useState();
	const [places, setPlaces] = useState([]);
	const id = userdetails._id;
	const openEmoji = () => {
		setEmojishow((prevEmojiShow) => !prevEmojiShow);
	};
	const [loading, setLoading] = useState(false);
	const addEmoji = (selectedEmoji) => {
		setText((prevText) => prevText + selectedEmoji.emoji);
	};

	useEffect(() => {
		if (imageUrl) {
			cropperRef.current = new Cropper(imageRef.current, {
				aspectRatio: 4 / 5,
				viewMode: 2,
				autoCropArea: 1,
				crop: () => {
					const croppedImage = cropperRef.current.getCroppedCanvas().toDataURL("image/jpeg");
					// Use the croppedImage URL as needed (e.g., save it, display it, etc.)
					setSelectedImage(croppedImage);
				}
			});
		}
		return () => {
			if (cropperRef.current) {
				cropperRef.current.destroy();
			}
		};
	}, [imageUrl]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			const objectUrl = URL.createObjectURL(file);
			setImageUrl(objectUrl);
		}
	};

	const handlePost = (e) => {
		e.preventDefault();

		if (!selectedImage) {
			showToast("warning", "Photo required for posting");
			return;
		}
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
		formData.append("location", location);
		formData.append("userId", id);
		formData.append("media", file);
		posts
			.post("/addpost", formData)
			.then((res) => {
				console.log(res);
				if (res.data.status) {
					console.log(res.data.message);
					setLoading(false);
					showToast("success", "Post added");
					onClose();
				}
			})
			.catch((error) => {
				if (error.response && error.response.status === 403) {
					// Handle 403 Forbidden error
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};
	const handleLocationAPI = (e) => {
		const updatedSearch = e.target.value;
		setLocation(updatedSearch);
		if (updatedSearch) {
			mapbox
				.get(
					`/${updatedSearch}.json?access_token=pk.eyJ1Ijoic2FjaGlubXMiLCJhIjoiY2xyN202c285MHBsNDJrcGF5Z2xmNTgyaCJ9.C35EQx1Ogm7j7YTXxtSCXA`
				)
				.then((res) => {
					if (res.data.features) {
						console.log(res.data.features);
						setPlaces(res.data.features);
					}
				})
				.catch((error) => {
					// Handle any errors in fetching data from mapbox
					console.error("Error fetching data:", error);
				});
		}
	};

	return (
		<>
			<Modal
				closeOnEsc={false}
				closeOnOverlayClick={false}
				onClick={onClose}
				className="bg-gray-700 text-white dark"
				style={{ height: modalHeight, width: "screen" }}
				show={isOpen}
				position="top-center"
				onClose={onClose}>
				<div
					className=""
					onClick={(e) => {
						e.stopPropagation();
					}}>
					<Modal.Header className="dark:bg-black bg-white  border-white">
						<h1 className="font-bold ms-56">Create new post</h1>
					</Modal.Header>
					{loading && (
						<div
							role="status"
							className="absolute z-10 w-full h-full bg-white dark:bg-black  opacity-50 flex justify-center items-center">
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
						<Modal.Body className="bg-white dark:bg-black">
							<div className="w-1/2 h-auto mx-auto p-4">
								<img ref={imageRef} src={imageUrl} className="max-w-full" />
							</div>
							<label for="file-upload" className="mr-3">
								<svg
									className="w-[25px] ms-72 h-[25px] text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="20"
									fill="none"
									viewBox="0 0 16 20">
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.4"
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
								onChange={handleFileChange}
								ref={inputRef}
								name="media"
							/>
							<div className="relative mb-5 flex items-center max-w-full">
								<Avatar size={"sm"} src={userdetails.propic.url} />
								<textarea
									name="textmedia"
									value={text}
									onChange={(e) => setText(e.target.value)}
									id="large-input"
									className="block w-2/3 me-5 ms-5 p-4 text-gray-900 rounded-lg bg-white sm:text-md  dark:bg-black dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y overflow-auto border-none"
									rows="2"
									placeholder="Write a caption..."></textarea>
								<div>
									<input
										onChange={(e) => {
											handleLocationAPI(e);
										}}
										className="bg-zinc-900 w-full  rounded-lg border-none"
										placeholder="Add location"
										type="text"
										value={location}
									/>
									<div style={{ position: "relative" }}>
										{places.length > 0 && location !== "" && (
											<div
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													right: 0,
													bottom: 0,
													zIndex: 999
												}}>
												{/* Box with places */}
												<Box
													className="bg-neutral-800 border-b border-black rounded-lg"
													display={"inline-flex"}
													flexWrap={"wrap"}
													mt={2}>
													{places.map((place) => (
														<div
															onClick={() => {
																setLocation(place.text);
																setPlaces([]); // Clear the places array after selecting a place
															}}
															className="flex w-full cursor-pointer ms-2 p-1 rounded-lg">
															<h2 className="mt-5 me-2 text-lg text-black font-bold">
																{place?.text}
															</h2>
														</div>
													))}
												</Box>
											</div>
										)}
									</div>
								</div>
							</div>
							<FontAwesomeIcon
								className="absolute bottom-20 right-60 p-2 cursor-pointer"
								icon={faFaceLaughSquint}
								onClick={openEmoji}
								style={{ color: "#ffffff" }}
							/>
						</Modal.Body>
						<div className="flex justify-around items-center dark:bg-black bg-white border-0 p-3">
							<Button type="submit">Post</Button>
						</div>
					</form>
				</div>
				{emojishow && (
					<div
						onClick={(e) => {
							e.stopPropagation();
						}}
						className="fixed transform -translate-x-1/2 -translate-y-1/2 z-50"
						style={{ top: selectedImage ? "530px" : "300px", right: "100px" }}>
						<EmojiPicker onEmojiClick={addEmoji} />
					</div>
				)}
			</Modal>
		</>
	);
}

export default PostModal;
