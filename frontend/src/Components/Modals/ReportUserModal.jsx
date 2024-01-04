import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { reportUser } from "../../constants/constant";
import { users } from "../../config/axios";
import useCustomToast from "../../toast";
import { Error403 } from "../../Commonfunctions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ReportUserModal = ({ user, onReportClose, isReportOpen }) => {
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const handleReport = async (reason) => {
    console.log(reason)
		try {
			users
				.post("/reportuser", { userId: user._id, reason })
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
					if (error.response && error.response.status === 403) {
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
			<Modal onClose={onReportClose} size={"xs"} isOpen={isReportOpen}>
				<ModalOverlay />
				<ModalContent style={{ backgroundColor: "#262626" }}>
					<ModalHeader className="text-center text-white">Report</ModalHeader>
					<ModalCloseButton className="text-white" />
					<ModalBody>
						<h2 className="text-lg mb-3 font-semibold font-serif text-center text-white">
							Why are you reporting this post?
						</h2>
						{reportUser.map((reason) => (
							<button
								className="text-white block w-full mb-2  py-2 rounded"
								key={reason.value}
								onClick={() => handleReport(reason.label)}>
								{reason.label}
							</button>
						))}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
export default ReportUserModal;
