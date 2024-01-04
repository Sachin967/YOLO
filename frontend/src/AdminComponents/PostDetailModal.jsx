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
import { admin } from "../config/axios";

const PostDetailModal = ({ post, isOpen, onClose }) => {
	console.log(post);

	return (
		<Modal onClose={onClose} size="xl" isOpen={isOpen}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader className="text-center text-white">Modal Title</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="p-4">
					<div className="flex justify-center">
						<img src={post?.media?.url} alt="" className="w-80 h-80 mb-4" />
					</div>
					<div className="flex justify-between text-gray-500 mb-4">
						<h2>
							PostId: <span className='text-white'>{post?._id}</span>{" "}
						</h2>
						<h2 >UserId: <span className='text-white'>{post?.userId}</span></h2>
						<h2>No of Reports: <span className='text-white'>{post?.reported?.length}</span></h2>
					</div>
					{post?.reported.map((reports, index) => (
						<div className="flex text-gray-500" key={index}> 
							<ul className="me-10">
								Reported by
								<li><span className='text-white'>{reports.reporter}</span></li>
							</ul>
							<ul>
								Reason
								<li><span className='text-white'>{reports?.reason}</span></li>
							</ul>
						</div>
					))}
				</ModalBody>

				<ModalFooter>
					<button className="text-gray-400 hover:text-white p-2">List</button>
					{/* <Button onClick={onClose}>Close</Button> */}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default PostDetailModal;
