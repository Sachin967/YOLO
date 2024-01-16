import { Switch } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { users } from "../config/axios";
import { useSelector } from "react-redux";

const AccountPrivacy = ({}) => {
	const [isChecked, setIsChecked] = useState(false);
	const { userdetails } = useSelector((state) => state.auth);
	const handleSwitchChange = () => {
		// Toggle the state when the switch is changed
		users
			.put(`/makeprivate/${userdetails._id}`, { isChecked: isChecked })
			.then((res) => {
				console.log(res.data);
				if (res.data.isPrivate) {
					setIsChecked(true);
				} else {
					setIsChecked(false);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const fetchUserDetails = () => {
		try {
			users.get(`/getuser/${userdetails._id}`).then((res) => {
				if (res.data) {
					console.log(res.data.isPrivate);
					setIsChecked(res.data.isPrivate);
				}
			});
			// console.log(response)
			// setIsChecked(response.data.isPrivate || false);
		} catch (error) {
			console.error("Error fetching user details:", error);
		}
	};
	useEffect(() => {
		fetchUserDetails();
	}, []);

	return (
		<div>
			<div className="flex justify-center  mt-20">
				<h1 className=" dark:text-white text-black font-bold text-2xl">Account privacy</h1>
			</div>
			<div className="w-[550px] ml-20">
				<div className="flex items-center mt-16">
					<h1 className="dark:text-white text-black text-lg ">Private Account</h1>
					<Switch className="ml-80" size="lg" isChecked={isChecked} onChange={handleSwitchChange} />
				</div>
				<div className="mt-10">
					<h1 className="">
						{" "}
						When your account is public, your profile and posts can be seen by anyone, on or off Instagram,
						even if they don’t have an Instagram account.
					</h1>
					<h1 className="mt-10">
						When your account is private, only the followers you approve can see what you share, including
						your photos or videos on hashtag and location pages, and your followers and following lists.
					</h1>
				</div>
			</div>
		</div>
	);
};
export default AccountPrivacy;
