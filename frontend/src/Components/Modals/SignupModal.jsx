import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from "@chakra-ui/react";
import { useState } from "react";
import { dayOptions, genderOptions, monthOptions, yearOptions } from "../../constants/constant";
import { users } from "../../config/axios";
import { useNavigate } from "react-router-dom";

const SignupModal = ({ onClose, isOpen, handleChange,formstate,showToast }) => {
const Navigate=useNavigate()
	const validateForm = () => {
		// Validation logic for each field
		const emailRegex = /^\S+@\S+\.\S+$/;

		// Email format validation
		if (
			!formstate.name ||
			!formstate.username ||
			!formstate.email ||
			!formstate.password ||
			!formstate.confirmPassword ||
			!formstate.day ||
			!formstate.month ||
			!formstate.year ||
			!formstate.gender
		) {
			showToast("warning", "All fields are required.");
			return false;
		}

		// For instance, for non-empty fields:
		if (!emailRegex.test(formstate.email)) {
			showToast("warning", "Invalid email format.");
			return false;
		}

		// Password match validation
		if (formstate.password !== formstate.confirmPassword) {
			showToast("warning", "Passwords do not match.");
			return false;
		}
		// Other validations as needed...

		return true;
	};

	const handleSignup = (e) => {
		e.preventDefault();
		const isValid = validateForm();
		if (isValid) {
			users
				.post("/register", formstate, { withCredentials: true })
				.then((response) => {
					console.log(response);
					const { Id } = response.data;
					if (response.statusText == "OK") {
						Navigate(`/verifyOtp/${Id}`);
					}
				})
				.catch((err) => console.log(err.message));
		} else {
		}
	};
	return (
		<Modal isCentered onClose={onClose} size={"md"} isOpen={isOpen} closeOnOverlayClick={false} closeOnEsc={false}>
			<ModalOverlay style={{ backgroundColor: "rgba(34, 34, 34, 0.98)" }} />
			<ModalContent style={{ backgroundColor: "#001133" }}>
				<ModalHeader>
					{" "}
					<h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
						Join Now.
					</h1>
				</ModalHeader>
				<ModalCloseButton className="text-white" />
				<ModalBody>
					{" "}
					<select
						className="w-full text-white bg-gray-700 rounded-lg mb-5"
						id="dropdown"
						name="gender"
						// value={selectedOption}
						onChange={(e) => handleChange(e)}>
						<option className="text-white" value="">
							Select your gender
						</option>
						{genderOptions.map((option, index) => (
							<option key={index} value={option}>
								{option}
							</option>
						))}
					</select>
					<div className="mb-5">
						<select
							className="bg-gray-700 text-white rounded-lg me-12 "
							// value={day}
							name="day"
							onChange={(e) => handleChange(e)}>
							<option value="">Day</option>
							{dayOptions.map((option) => (
								<option className="" key={option} value={option}>
									{option}
								</option>
							))}
						</select>
						<select
							className="bg-gray-700 text-white me-12 rounded-lg"
							// value={month}
							name="month"
							onChange={(e) => handleChange(e)}>
							<option value="">Month</option>
							{monthOptions.map((option, index) => (
								<option key={index} value={index + 1}>
									{option}
								</option>
							))}
						</select>
						<select
							className="bg-gray-700 text-white rounded-lg"
							// value={year}
							name="year"
							onChange={(e) => handleChange(e)}>
							<option value="">Year</option>
							{yearOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</div>
					<div className="mb-5">
						<input
							onChange={(e) => handleChange(e)}
							type="password"
							name="password"
							id="password"
							placeholder="Enter your password"
							className="bg-gray-700 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							required=""
						/>
					</div>
					<div>
						<input
							onChange={(e) => handleChange(e)}
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							placeholder="Confirm your password"
							className="bg-gray-700 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							required=""
						/>
					</div>
				</ModalBody>
				<ModalFooter>
					<button
						onClick={handleSignup}
						type="submit"
						className="w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
						Create an account
					</button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default SignupModal;
