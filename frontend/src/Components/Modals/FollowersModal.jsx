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
const FollowersModal = ({ onFollowersClose, isFollowersOpen, userId, follow, FollowUsers }) => {
	const [followers, setFollowers] = useState();
	const [search, setSearch] = useState();
	useEffect(() => {
		FetchFollowers();
	}, [userId]);
	const FetchFollowers = () => {
		users
			.get(`/fetchfollowers/${userId}`)
			.then((res) => {
				if (res.data) {
					console.log(res.data);
					setFollowers(res.data.followers);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const filteredUsers = search
		? followers?.filter((user) => {
				return (
					user.name.toLowerCase().includes(search?.toLowerCase()) ||
					user.username.toLowerCase().includes(search?.toLowerCase())
				);
		  })
		: followers;

	return (
		<Modal scrollBehavior="inside" onClose={onFollowersClose} size={"sm"} isOpen={isFollowersOpen}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader className="text-center text-white">Followers</ModalHeader>
				<ModalCloseButton className="hover:text-white" />
				<ModalBody>
					<input
						onChange={(e) => setSearch(e.target.value)}
						value={search}
						placeholder="Search"
						type="text"
						className="w-full text-white mb-3 rounded-full bg-transparent"
					/>
					{filteredUsers?.map((fol) => (
						<>
							<div className="flex hover:bg-slate-900 p-5">
								<Link onClick={onFollowersClose} to={`/${fol?.username}`}>
									<Avatar className="mr-5" src={fol?.propic?.url} />
									<div>
										<h2 className="text-white">{fol?.name}</h2>
										<h2 className="text-gray-600">{fol?.username}</h2>
									</div>
								</Link>
								<button
									onClick={() => FollowUsers(fol._id)}
									className={
										filteredUsers.some((user) => user._id === fol._id)
											? "text-red-600 border border-red-600 h-9 w-24 bg-black rounded-3xl"
											: "text-green-600 border border-green-600 h-9 w-24 bg-black rounded-3xl"
									}>
									{filteredUsers.some((user) => user._id === fol._id) ? "Unfollow" : "Follow"}
								</button>
							</div>
						</>
					))}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
export default FollowersModal;
