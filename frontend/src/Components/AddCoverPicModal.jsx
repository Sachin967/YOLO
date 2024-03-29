import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { users } from "../config/axios";
import useCustomToast from "../config/toast";
import { AuthActions } from "../store/Authslice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Error403 } from "../Commonfunctions";
const AddCoverPicModal = ({ isOpen, onClose, username, showUserProfile, isCoverPic }) => {
	const imageRef = useRef(null);
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [croppedCoverImage, setCroppedCoverImage] = useState(null);
	const [croppedProfileImage, setCroppedProfileImage] = useState(null);
	let cropper;
	const showToast = useCustomToast();
	const onSelectFile = (e) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (imageRef.current && reader.result) {
				console.log(reader.result);
				imageRef.current.src = reader.result;
				cropper = new Cropper(imageRef.current, {
					// Configure cropper options here
					aspectRatio: isCoverPic ? 7 / 2 : 1 / 1,
					crop: () => {
						const canvas = cropper.getCroppedCanvas();
						if (isCoverPic) {
							setCroppedCoverImage(canvas.toDataURL("image/jpeg"));
						} else {
							setCroppedProfileImage(canvas.toDataURL("image/jpeg"));
						}
					}
				});
			}
		};
		if (e.target.files && e.target.files.length > 0) {
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const uploadPic = () => {
		setLoading(true);
		const url = isCoverPic ? `/addcoverimage/${username}` : `/addprofileimage/${username}`;
		const imageData = isCoverPic ? croppedCoverImage : croppedProfileImage;
		users
			.post(url, { croppedImage: imageData }) // Use 'croppedImage' as the key
			.then((res) => {
				if (res.data.status === "uploaded") {
					setLoading(false);
					onClose();
					showToast("success", "Image Updated");
					showUserProfile();
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

	return (
		<>
			<Modal onClose={onClose} size="xl" isOpen={isOpen}>
				<ModalOverlay />
				<ModalContent style={{ height: "600px" }}>
					<ModalHeader className="text-center text-black dark:text-white">Edit Cover Pic</ModalHeader>
					<ModalCloseButton className="absolute top-0 left-0" />
					<button onClick={uploadPic} className="absolute text-white top-2 right-5">
						Apply
					</button>
					{loading && (
						<div
							role="status"
							className="absolute z-10 w-full h-full dark:bg-black bg-white opacity-50 flex justify-center items-center">
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
					<ModalBody className="bg-zinc-800 flex items-center justify-center ">
						<div className="">
							<div className="w-full me-6 p-4">
								<img ref={imageRef} className="max-w-[250px] max-h-[350px]" />
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<input type="file" accept="image/*" onChange={onSelectFile} className="" />
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddCoverPicModal;
