import background from "../assets/admin1.jpg";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { admin } from "../config/axios";
import { AdminActions } from "../store/Adminauthslice";

const AdminLogin = () => {
	const adminLoggedIn = useSelector((state) => {
		state.admin.Adminisloggedin;
	});
	const Dispatch = useDispatch();
	const Navigate = useNavigate();
	useEffect(() => {
		if (adminLoggedIn) {
			Navigate("/admin");
		}
	}, [adminLoggedIn]);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((prevState) => ({
			...prevState,
			[name]: value
		}));
	};

	const [formstate, setFormState] = useState({
		email: "",
		password: ""
	});
	const generateerror = (err) => {
		toast.error(err, {
			position: "bottom-left",
			theme: "dark"
		});
	};
	const validateForm = () => {
		// Email format validation
		if (!formstate.email || !formstate.password) {
			generateerror("Both fields are required.");
			return false;
		}

		return true; // Return true if all validations pass
	};
	const handleSignIn = (e) => {
		e.preventDefault();

		const isValid = validateForm();
		if (isValid) {
			admin
				.post("/login", formstate, { withCredentials: true })
				.then((res) => {
					if (res.data.status) {
						Dispatch(AdminActions.AdminLogin(res.data));
						Navigate("/admin");
					}
				})
				.catch((err) => console.log(err));
		}
	};
	return (
		<section className="bg-auto bg-center h-screen" style={{ backgroundImage: `url(${background})` }}>
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<a href="#" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
					<img className="w-40 h-40 rounded-full" src="../yolo2.png" alt="logo" />
				</a>
				<div className="w-full bg-gray-950 bg-opacity-70 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
							Welcome Back Admin
						</h1>
						<form className="space-y-4 md:space-y-6">
							<div>
								<label
									htmlFor="email"
									className="text-gray-400 block mb-2 text-sm font-medium text-#313338 dark:text-white">
									Email
									<span className="text-red-700">*</span>
								</label>
								<input
									onChange={(e) => handleChange(e)}
									type="email"
									value={formstate.email}
									name="email"
									id="email"
									className="bg-gray-700 bg-opacity-70 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
									className="bg-gray-700 bg-opacity-70 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required=""
								/>
							</div>
							<div className="flex items-center justify-between">
								<Link
									to="#"
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
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};
export default AdminLogin;
