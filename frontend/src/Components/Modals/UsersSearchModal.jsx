import {
	Avatar,
	Box,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { messaging, users } from "../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useCustomToast from "../../config/toast";
const UsersSearchModal = ({ onClose, isOpen, userss, chatId, fetchMessages }) => {
	const [user, setUser] = useState([]);
	const showToast = useCustomToast();
	const [search, setSearch] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const handleInputChange = (e) => {
		setSearch(e.target.value);
		fetchAllUsers();
	};
	const fetchAllUsers = () => {
		users
			.get(`/users/${search}`)
			.then((res) => {
				if (res.data) {
					setUser(res.data);
				}
			})
			.catch((error) => console.log(error));
	};
	const handleUserSelect = (user) => {
		setSelectedUsers((prevSelected) => {
			const isUserSelected = prevSelected.find((selectedUser) => selectedUser._id === user._id);
			if (!isUserSelected) {
				return [...prevSelected, user];
			}
			return prevSelected;
		});
	};
	const RemoveSelected = (deleteduser) => {
		setSelectedUsers(selectedUsers.filter((user) => user._id !== deleteduser._id));
	};

	const AddUser = () => {
		console.log(selectedUsers);
		if (selectedUsers.length < 1) {
			showToast("warning", "Add all fields");
			return;
		}
		try {
			messaging
				.put("/groupadd", {
					chatId,
					users: JSON.stringify(selectedUsers.filter((user) => user._id))
				})
				.then((res) => {
					console.log(res);
					if (res.data) {
						fetchMessages();
						onClose();
						showToast("success", "User Added");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {}
	};
	return (
		<Modal scrollBehavior="inside" onClose={onClose} size="xl" isOpen={isOpen}>
			<ModalOverlay />
			<ModalContent style={{ backgroundColor: "#131313" }}>
				<ModalHeader>
					<h1 className="text-white">Add People</h1>
					<button
						onClick={AddUser}
						className="absolute text-white top-4 p-2 right-14 rounded-2xl bg-stone-800">
						Add
					</button>
				</ModalHeader>
				<ModalCloseButton className="text-white" />
				<ModalBody>
					<div className="flex mb-5">
						<input
							value={search}
							onChange={handleInputChange}
							className="bg-transparent text-white w-full border-transparent rounded-2xl"
							type="text"
							placeholder="Add friends"
						/>
					</div>
					{selectedUsers.length > 0 && (
						<Box display={"inline-flex"} flexWrap={"wrap"} mt={2}>
							{selectedUsers.map((selectedUser) => (
								<Box
									className="text-white"
									backgroundColor={"GrayText"}
									m={1}
									px={2}
									py={1}
									borderRadius={"lg"}
									mb={2}
									key={selectedUser._id}>
									{selectedUser.name} - {selectedUser.username}
									<FontAwesomeIcon
										onClick={() => RemoveSelected(selectedUser)}
										className="pl-2 cursor-pointer"
										icon={faXmark}
									/>
								</Box>
							))}
						</Box>
					)}
					<div>
						{user.map((u) => (
							<div
								onClick={() => handleUserSelect(u)}
								className="flex items-center space-x-4 pb-2 hover:bg-zinc-800">
								<Avatar src={u?.propic?.url}></Avatar>
								<div className="flex-1">
									<h1 className="text-lg text-gray-300 font-bold">{u?.name}</h1>
									<h1 className="text-gray-500">{u?.username}</h1>
								</div>
							</div>
						))}
					</div>
				</ModalBody>
				<ModalFooter></ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default UsersSearchModal;
