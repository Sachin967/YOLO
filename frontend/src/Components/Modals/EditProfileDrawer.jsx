import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	FormLabel,
	Input,
	Stack
} from "@chakra-ui/react";
import { Select, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { users } from "../../config/axios";
import { AuthActions } from "../../store/Authslice";
import useCustomToast from "../../config/toast";
import { useNavigate } from "react-router-dom";
import { Error403 } from "../../Commonfunctions";
import { dayOptions, monthOptions, yearOptions } from "../../constants/constant";
import { faL } from "@fortawesome/free-solid-svg-icons";
function EditProfileDrawer({ isOpen, onClose, showUserProfile }) {
	const firstField = React.useRef();
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate;
	const { userdetails } = useSelector((state) => state.auth);
	const [updatedUser, setUpdatedUser] = useState({
		name: "",
		bio: "",
		location: "",
		day: "",
		month: "",
		year: ""
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUpdatedUser((prevUser) => ({
			...prevUser,
			[name]: value
		}));
	};

	useEffect(() => {
		if (userdetails) {
			setUpdatedUser({
				name: userdetails?.name || "",
				bio: userdetails?.bio || "",
				location: userdetails?.location || "",
				day: userdetails.day || "",
				month: userdetails.month || "",
				year: userdetails.year || ""
			});
		}
	}, [userdetails]);
	const handleEditUserProfile = () => {
		users
			.put(`/editprofile/${userdetails._id}`, { updatedUser })
			.then((res) => {
				if (res.data) {
					dispatch(AuthActions.Userupdate(res.data));
					console.log(res.data);
					setUpdatedUser(res.data);
					showUserProfile();
					onClose();
					showToast("success", "Profile updated");
				}
			})
			.catch((error) => {
				if (error.response &&error.response.status === 403) {
					// Handle 403 Forbidden error
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};

	return (
		<>
			<Drawer
				onEsc={false}
				onOverlayClick={false}
				isOpen={isOpen}
				placement="right"
				initialFocusRef={firstField}
				onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent style={{ backgroundColor: "#262626" }}>
					<DrawerCloseButton className="text-white" />
					<DrawerHeader className=" text-white" borderBottomWidth="1px">
						Edit Profile
					</DrawerHeader>

					<DrawerBody className="">
						<Stack spacing="50px">
							<Box>
								<FormLabel className="text-white mt-5" htmlFor="username">
									Name
								</FormLabel>
								<Input
									ref={firstField}
									id="name"
									name="name"
									value={updatedUser?.name}
									className="text-white "
									placeholder="Please enter user name"
									onChange={(e) => handleInputChange(e)}
								/>
							</Box>
							<Box>
								<FormLabel className="text-white" htmlFor="desc">
									Bio
								</FormLabel>
								<Textarea
									style={{ backgroundColor: "#262626" }}
									className=" text-white"
									onChange={(e) => handleInputChange(e)}
									value={updatedUser?.bio}
									id="desc"
									name="bio"
								/>
							</Box>
							<Box>
								<FormLabel className="text-white" htmlFor="location">
									Location
								</FormLabel>
								<Input
									className="text-white"
									id="location"
									onChange={(e) => handleInputChange(e)}
									value={updatedUser?.location}
									placeholder="Please enter location"
									name="location"
								/>
							</Box>
							<Box>
								<FormLabel className="text-white" htmlFor="location">
									Birth Date
								</FormLabel>
								<div className="flex">
									<Select
										style={{ backgroundColor: "gray" }}
										className="w-[115px] mr-3 bg-gray-700"
										defaultValue=""
										onChange={(e) =>
											handleInputChange({ target: { name: "month", value: e.target.value } })
										}
										value={updatedUser?.month}
										placeholder="Month">
										{monthOptions.map((option, index) => (
											<option key={index} value={index + 1}>
												{option}
											</option>
										))}
									</Select>
									<Select
										style={{ backgroundColor: "gray" }}
										className="w-[85px]  mr-3"
										defaultValue=""
										onChange={(e) =>
											handleInputChange({ target: { name: "day", value: e.target.value } })
										}
										value={updatedUser?.day}
										placeholder="Day">
										{dayOptions.map((option) => (
											<option className="" key={option} value={option}>
												{option}
											</option>
										))}
									</Select>
									<Select
										style={{ backgroundColor: "gray" }}
										className="w-[100px]"
										defaultValue=""
										onChange={(e) =>
											handleInputChange({ target: { name: "year", value: e.target.value } })
										}
										value={updatedUser?.year}
										placeholder="Year">
										{yearOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</Select>
								</div>
								{/* <FormLabel className="text-white mt-5" htmlFor="location">
									Who sees this?
								</FormLabel>
								<Select className="mb-5" placeholder="Year">
									<option value="" disabled hidden>
										Month and Day
									</option>
									<option value="option1">Only You</option>
									<option value="option2">Followers</option>
									<option value="option3">Public</option>
								</Select>
								<Select className="" placeholder="Year">
									<option value="" disabled hidden>
										Year
									</option>
									<option value="option1">Only You</option>
									<option value="option2">Followers</option>
									<option value="option3">Public</option>
								</Select> */}
							</Box>
							{/* <Box className="text-center">
								<button onClick={} className=" hover:bg-red-950 p-2 text-lg text-red-600 rounded-2xl">
									Remove Date of Birth
								</button>
							</Box> */}
						</Stack>
					</DrawerBody>

					<DrawerFooter className="text-white" borderTopWidth="1px">
						{/* <Button variant="outline" mr={3} onClick={onClose}>
							Cancel
						</Button> */}
						<Button onClick={handleEditUserProfile} colorScheme="blue">
							Submit
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}

export default EditProfileDrawer;
