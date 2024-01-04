import {
	Avatar,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { users } from "../../config/axios";
import { Link } from "react-router-dom";

const FollowingModal = ({ onFollowingClose, isFollowingOpen,userId }) => {
	const [search, setSearch] = useState();
	const [following, setFollowing] = useState();
	useEffect(() => {
		FetchFollowers();
	}, [userId]);
	const FetchFollowers = () => {
		users
			.get(`/fetchfollowing/${userId}`)
			.then((res) => {
				if (res.data) {
          console.log(res.data)
					setFollowing(res.data.following);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const filteredUsers = search
		? following?.filter((user) => {
				return (
					user.name.toLowerCase().includes(search?.toLowerCase()) ||
					user.username.toLowerCase().includes(search?.toLowerCase())
				);
		  })
		: following;
	return (
		<Modal onClose={onFollowingClose} size="sm" isOpen={isFollowingOpen}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader className="text-center text-white">Following</ModalHeader>
				<ModalCloseButton className="hover:text-white" />
				<ModalBody>
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search"
						type="text"
						className="w-full text-white mb-3 rounded-full bg-transparent"
					/>
					{filteredUsers?.map((fol) => (
						<>
							<Link onClick={onFollowingClose} to={`/${fol?.username}`}>
								<div className="flex hover:bg-slate-900 p-5">
									<Avatar className="mr-5" src={fol?.propic?.url} />
									<div>
										<h2 className="text-white">{fol?.name}</h2>
										<h2 className="text-gray-600">{fol?.username}</h2>
									</div>
								</div>
							</Link>
						</>
					))}
				</ModalBody>
				{/* <ModalFooter>
					<Button onClick={onFollowingClose}>Close</Button>
				</ModalFooter> */}
			</ModalContent>
		</Modal>
	);
};
export default FollowingModal;
