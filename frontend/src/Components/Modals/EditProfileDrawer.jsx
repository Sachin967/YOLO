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
import useCustomToast from "../../toast";
import { useNavigate } from "react-router-dom";
import { Error403 } from "../../Commonfunctions";
function EditProfileDrawer({ isOpen, onClose, showUserProfile }) {
	const firstField = React.useRef();
	const showToast = useCustomToast();
	const dispatch = useDispatch();
	const Navigate = useNavigate;
	const { userdetails } = useSelector((state) => state.auth);
	const [updatedUser, setUpdatedUser] = useState({
		name: "",
		bio: "",
		location: ""
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
				location: userdetails?.location || ""
			});
		}
	}, [userdetails]);
	const handleEditUserProfile = () => {
		users
			.put(`/editprofile/${userdetails._id}`, { updatedUser })
			.then((res) => {
				if (res.data) {
					dispatch(AuthActions.Userupdate(res.data));
					setUpdatedUser(res.data);
					showUserProfile();
					onClose();
					showToast("success", "Profile updated");
				}
			})
			.catch((error) => {
				if (error.response.status === 403) {
					// Handle 403 Forbidden error
					Error403(error, showToast, dispatch, Navigate);
				} else {
					console.error("Error:", error);
				}
			});
	};

	return (
		<>
			<Drawer isOpen={isOpen} placement="right" initialFocusRef={firstField} onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent style={{ backgroundColor: "#262626" }}>
					<DrawerCloseButton className="text-white" />
					<DrawerHeader className=" text-white" borderBottomWidth="1px">
						Edit Profile
					</DrawerHeader>

					<DrawerBody className="">
						<Stack spacing="24px">
							<Box>
								<FormLabel className="text-white" htmlFor="username">
									Name
								</FormLabel>
								<Input
									ref={firstField}
									id="name"
									name="name"
									value={updatedUser?.name}
									className="text-white"
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
									<Select className="w-[115px] mr-3" defaultValue="" placeholder="Month">
										<option value={updatedUser?.month} disabled hidden>
											Month
										</option>
										<option value="January">January</option>
										<option value="February">February</option>
										{/* Add other months */}
									</Select>
									<Select className="w-[85px] mr-3" defaultValue="" placeholder="Day">
										<option value={updatedUser?.day} disabled hidden>
											Day
										</option>
										<option value="01">01</option>
										<option value="02">02</option>
										{/* Add other days */}
									</Select>
									<Select className="w-[100px]" defaultValue="" placeholder="Year">
										<option value={updatedUser?.year} disabled hidden>
											Year
										</option>
										<option value="2000">2000</option>
										<option value="2001">2001</option>
										{/* Add other years */}
									</Select>
								</div>
								<FormLabel className="text-white mt-5" htmlFor="location">
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
								</Select>
							</Box>
							<Box className="text-center">
								<button className=" hover:bg-red-950 p-2 text-lg text-red-600 rounded-2xl">
									Remove Date of Birth
								</button>
							</Box>
						</Stack>
					</DrawerBody>

					<DrawerFooter className="text-white" borderTopWidth="1px">
						<Button variant="outline" mr={3} onClick={onClose}>
							Cancel
						</Button>
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
