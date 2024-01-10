import {
	Avatar,
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text
} from "@chakra-ui/react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useCustomToast from "../../toast";
import { messaging } from "../../config/axios";

const GroupChatModal = ({ isOpen, onClose, filteredUsers, FetchChats }) => {
	const [groupChatname, setgroupChatname] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const showToast = useCustomToast();
	const [chats, setChats] = useState([]);
	const filter = filteredUsers.filter((user) => {
		const hasName = user?.name && user.name.toLowerCase().includes(search.toLowerCase());
		const hasUsername = user?.username && user.username.toLowerCase().includes(search.toLowerCase());

		return hasName || hasUsername;
	});
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

	const handleSubmit = () => {
		console.log();
		if (!groupChatname || !selectedUsers) {
			showToast("warning", "Add all fields");
			return;
		}
		try {
			messaging
				.post("/group", {
					name: groupChatname,
					users: JSON.stringify(selectedUsers.filter((user) => user._id))
				})
				.then((res) => {
					if (res.data) {
						setChats(res.data);
						onClose();
						showToast("success", "Group Created");
						FetchChats();
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {}
	};
	return (
		<Modal onClose={onClose} size={"md"} isOpen={isOpen}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader
					fontSize={"35px"}
					fontFamily={"Work sans"}
					textColor={"wheat"}
					display={"flex"}
					justifyContent={"center"}>
					{" "}
					Create Group Chat
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
					<FormControl>
						<Input
							placeholder="Chat Name"
							textColor={"wheat"}
							mb={"3"}
							onChange={(e) => setgroupChatname(e.target.value)}
						/>
					</FormControl>
					<FormControl>
						<Input
							textColor={"wheat"}
							placeholder="Add Users"
							mb={1}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</FormControl>
					{selectedUsers.length > 0 && (
						<Box display={"inline-flex"} flexWrap={"wrap"} mt={2}>
							{/* <Text fontWeight="bold" mb={2}>
								Selected Users:
							</Text> */}
							{selectedUsers.map((selectedUser) => (
								<Box
									backgroundColor={"gainsboro"}
									m={1}
									px={2}
									py={1}
									borderRadius={"lg"}
									mb={2}
									key={selectedUser._id}
									textColor={"black"}>
									{selectedUser.name} - {selectedUser.username}
									<FontAwesomeIcon
										onClick={() => RemoveSelected(selectedUser)}
										className="pl-2 cursor-pointer"
										icon={faXmark}
										style={{ color: "#ffffff" }}
									/>
								</Box>
							))}
						</Box>
					)}
					{search !== "" && (
						<>
							{filter.map((user) => (
								<Box
									onClick={() => handleUserSelect(user)}
									key={user?._id}
									cursor="pointer"
									bg="#151515"
									_hover={{
										background: "#c0c0c0",
										color: "black"
									}}
									w="100%"
									d="flex"
									alignItems="center"
									color="black"
									px={3}
									py={1}
									mb={1}
									borderRadius="lg"
									borderColor={"aqua"}>
									<Avatar mr={2} size="sm" cursor="pointer" name="" src={user?.propic?.url} />
									<Box>
										<Text textColor={"beige"}>{user?.name}</Text>
										<Text textColor={"burlywood"} fontSize="xs">
											{user?.username}
										</Text>
									</Box>
								</Box>
							))}
						</>
					)}
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="blue" onClick={handleSubmit}>
						Create Chat
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default GroupChatModal;
