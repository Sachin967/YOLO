import { Link, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { users } from "../config/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AuthActions } from "../store/Authslice.js";
import useCustomToast from "../config/toast.js";
const Login = () => {
	const showToast = useCustomToast();
	const userLoggedIn = useSelector((state) => state.auth.Userisloggedin);
	const Dispatch = useDispatch();
	const Navigate = useNavigate();
	useEffect(() => {
		if (userLoggedIn) {
			Navigate("/");
		}
	}, [userLoggedIn]);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((prevState) => ({
			...prevState,
			[name]: value
		}));
	};
	const [formstate, setFormState] = useState({
		query: "",
		password: ""
	});

	const validateForm = () => {
		// Email format validation
		if (!formstate.query || !formstate.password) {
			showToast("warning", "Both fields are required.");
			return false;
		}
		return true;
	};
	const handleSignIn = (e) => {
		e.preventDefault();

		const isValid = validateForm();
		console.log(isValid);
		if (isValid) {
			console.log("hi");
			users
				.post("/login", formstate, { withCredentials: true })
				.then((res) => {
					console.log(res.data);
					if (res.data.status === true) {
						Dispatch(AuthActions.Userlogin(res.data));
						Navigate("/");
					} else if (res.data.state === true) {
						showToast("warning", res.data.msg);
						console.log(res);
					} else {
						showToast("error", res.data.msg);
					}
				})
				.catch((error) => {
					if (error.response && error.response.status === 401) {
						showToast("error", error.response.data);
					} else {
						console.log(error);
					}
				});
		}
	};
	return (
		<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
			<a href="#" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
				<img className="w-40 h-40 rounded-full mr-2" src="./yolo2.png" alt="logo" />
			</a>
			<div className="w-full bg-gray-950 bg-opacity-80 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
						Welcome Back
					</h1>
					<form className="space-y-4 md:space-y-6">
						<div>
							<label
								htmlFor="email"
								className="text-gray-400 block mb-2 text-sm font-medium text-#313338 dark:text-white">
								Email or Username
								<span className="text-red-700">*</span>
							</label>
							<input
								onChange={(e) => handleChange(e)}
								type="text"
								value={formstate.query}
								name="query"
								id="email"
								className="bg-gray-700 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder=""
								required=""
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="text-gray-400 block mb-2 text-sm font-medium dark:text-white">
								Password
								<span className="text-red-700">*</span>
							</label>
							<input
								value={formstate.password}
								onChange={(e) => handleChange(e)}
								type="password"
								name="password"
								id="password"
								placeholder=""
								className="bg-gray-700 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								required=""
							/>
						</div>
						<div className="flex items-center justify-between">
							<Link
								to="/password/reset"
								className="text-sky-500 text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
								Forgot password?
							</Link>
						</div>
						<button
							onClick={(e) => handleSignIn(e)}
							type="submit"
							className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
							Sign in
						</button>
						<p className="text-sm font-light text-gray-500 dark:text-gray-400">
							Don’t have an account yet?{" "}
							<Link
								to="/signup"
								className="font-medium text-sky-500 hover:underline dark:text-primary-500">
								Sign up
							</Link>
						</p>
						<GoogleOAuthProvider clientId="1004197948286-h9lju9u18le55rs7htuehhrtmaovh6cs.apps.googleusercontent.com">
							<GoogleLogin
								onSuccess={(credentialResponse) => {
									const decoded = jwtDecode(credentialResponse.credential);
									console.log(decoded);
									users
										.post("/googleauth", decoded, { withCredentials: true })
										.then((response) => {
											console.log(response);
											Dispatch(AuthActions.Userlogin(response.data));
											Navigate("/");
										})
										.catch((error) => {
											if (error.response && error.response.status === 401) {
												showToast("error", error.response.data);
											}
										});
								}}
								onError={() => {
									console.log("Login Failed");
								}}
							/>
						</GoogleOAuthProvider>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Login;
