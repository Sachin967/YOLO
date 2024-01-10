import { Link, useNavigate } from "react-router-dom";
import { users } from "../config/axios.js";
import { jwtDecode } from "jwt-decode";
import { useEffect, useReducer } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "../store/Authslice.js";
import useCustomToast from "../toast.js";
import { useDisclosure } from "@chakra-ui/react";
import SignupModal from "./Modals/SignupModal.jsx";

const Signup = () => {
	const showToast = useCustomToast();
	const Dispatch = useDispatch();
	const Navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const userLoggedIn = useSelector((state) => state.auth.Userisloggedin);
	useEffect(() => {
		if (userLoggedIn) {
			Navigate("/");
		}
	}, [userLoggedIn]);
	const handleChange = (e) => {
		dispatch({
			type: "handleinput",
			field: e.target.name,
			payload: e.target.value
		});
	};
	const intialState = {
		name: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		gender: "",
		day: "",
		month: "",
		year: ""
	};
	const reducer = (state, action) => {
		switch (action.type) {
			case "handleinput":
				return {
					...state,
					[action.field]: action.payload
				};
			default:
				break;
		}
	};
	const [formstate, dispatch] = useReducer(reducer, intialState);

	return (
		<div className="flex flex-col items-center justify-center px-6 py-0 mx-auto md:h-screen lg:py-0">
			<a href="#" className="flex items-center mb-1 text-2xl font-semibold text-gray-900 dark:text-white">
				<img className="w-32 h-32 rounded-full mr-2" src="./yolo2.png" alt="logo" />
			</a>
			<div className="w-full bg-gray-950 bg-opacity-80 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
						Join today.
					</h1>
					{/* <form className="space-y-4 md:space-y-6"> */}
					<div>
						<input
							onChange={(e) => handleChange(e)}
							type="text"
							name="name"
							id="name"
							className="bg-gray-700 text-white sm:text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
							placeholder="Enter your name"
							required=""
						/>
					</div>
					<div>
						<input
							onChange={(e) => handleChange(e)}
							type="text"
							name="username"
							id="username"
							className="bg-gray-700 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Enter a unique Username"
							required=""
						/>
					</div>
					<div>
						<input
							onChange={(e) => handleChange(e)}
							type="email"
							name="email"
							id="email"
							className="bg-gray-700 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Enter your email"
							required=""
						/>
					</div>

					<button
						onClick={onOpen}
						className="w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
						Next
					</button>
					<p className="text-sm font-light text-gray-500 dark:text-gray-400">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-medium text-primary-600 hover:underline dark:text-primary-500">
							Login here
						</Link>
					</p>
					{/* </form> */}
					<SignupModal
						isOpen={isOpen}
						showToast={showToast}
						onClose={onClose}
						formstate={formstate}
						handleChange={handleChange}
					/>
					<GoogleOAuthProvider clientId="1004197948286-h9lju9u18le55rs7htuehhrtmaovh6cs.apps.googleusercontent.com">
						<GoogleLogin
							onSuccess={(credentialResponse) => {
								const decoded = jwtDecode(credentialResponse.credential);
								console.log(decoded);
								users
									.post("/googleauth", decoded, { withCredentials: true })
									.then((response) => {
										Dispatch(AuthActions.Userlogin(response.data));
										Navigate("/");
									})
									.catch((err) => {
										if (err.response && err.response.status === 401) {
											showToast("error", err.response.data);
										}
									});
							}}
							onError={() => {
								console.log("Login Failed");
							}}
						/>
					</GoogleOAuthProvider>
				</div>
			</div>
		</div>
	);
};
export default Signup;
