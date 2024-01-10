import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { messaging } from "../../config/axios";

const GroupInfoEditModal = ({ groupImage, onClose, isOpen, chatName, chatId, setUpdatedImage, setUpdatedName }) => {
	const [inputValue, setInputValue] = useState(chatName);
	const [image, setImage] = useState(null);

	function handleFileSelection(event) {
		const file = event.target.files[0];
		setImage(file);
		if (file) {
			setFileToBase(file);
		}
	}
	const setFileToBase = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setImage(reader.result);
		};
	};
	const EditChanges = () => {
		messaging
			.put(`/renamegroup/${chatId}`, { groupimage: image, chatname: inputValue })
			.then((res) => {
				if (res.data) {
					console.log(res.data.chatName);
					console.log(res.data.groupImage.url);
					setUpdatedName(res?.data?.chatName);
					setUpdatedImage(res?.data?.groupImage.url);
					onClose();
				}
			})
			.catch((error) => console.log(error));
	};

	return (
		<Modal onClose={onClose} size="lg" isOpen={isOpen}>
			<ModalOverlay />
			<ModalContent className="absolute ">
				<ModalHeader>
					<h1>Edit</h1>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex justify-center items-center h-full">
					{image ? (
						<img className="w-20 rounded-full h-20" src={image} alt="Uploaded" />
					) : (
						groupImage && <img className="w-20 rounded-full h-20" src={groupImage} alt="Default" />
					)}
					<label htmlFor="fileInput" className="absolute top-24 cursor-pointer">
						<svg width={28} height={28} viewBox="0 0 24 24" aria-hidden="true" className="bg-white ">
							<g>
								<path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
							</g>
						</svg>
					</label>
					<input
						id="fileInput"
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => handleFileSelection(e)}
					/>
				</ModalBody>
				<div className="relative mt-20 flex items-center justify-center">
					<input
						className="w-[450px] border rounded-3xl text-white bg-transparent px-3 py-5 focus:outline-none focus:border-blue-500"
						type="text"
						id="inputField"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<label
						htmlFor="inputField"
						className={`absolute top-0 text-gray-300 left-0 transition-all duration-300 ${
							inputValue ? "text-xs text-gray-500 pt-1 pl-3 left-8" : "top-5 left-8 text-base  pl-3"
						}`}>
						Enter your text
					</label>
				</div>

				<ModalFooter>
					<button onClick={EditChanges} className="text-white">
						Save
					</button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default GroupInfoEditModal;
