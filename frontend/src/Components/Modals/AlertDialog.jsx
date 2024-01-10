import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogCloseButton,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button
} from "@chakra-ui/react";
import { useRef } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { messaging } from "../../config/axios";

const AlertLeaveGroup = ({ onClose, isOpen, userId, chatId, FetchChats }) => {
	const { setSelectedUsers } = ChatState();
	const cancelRef = useRef();

	const LeaveGroup = () => {
		messaging
			.put("/groupremove", { userId, chatId })
			.then((res) => {
				console.log(res);
				FetchChats();
				setSelectedUsers(null);
			})
			.catch((error) => console.log(error));
	};

	return (
		<AlertDialog
			motionPreset="slideInBottom"
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isOpen={isOpen}
			isCentered>
			<AlertDialogOverlay />

			<AlertDialogContent>
				<AlertDialogHeader className="text-gray-300">Discard Changes?</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody className="text-gray-500">
					Are you sure you want to leave this group? All your messages will be deleted.
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={onClose}>
						No
					</Button>
					<Button onClick={LeaveGroup} colorScheme="red" ml={3}>
						Yes
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
export default AlertLeaveGroup;
