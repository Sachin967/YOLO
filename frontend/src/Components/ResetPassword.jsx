import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { users } from "../config/axios";
import useCustomToast from "../toast";
import background from "../assets/bg.svg";
const ResetPassword = () => {
	const { token, userId } = useParams();
	const [valid, setValid] = useState(true);
	const [password, setPassword] = useState("");
	const [conpassword, setConPassword] = useState("");
	const showToast = useCustomToast();
	const Navigate = useNavigate();
	useEffect(() => {
		validateToken();
	}, [token]);

	const validateToken = () => {
		users
			.get(`/validatetoken/${token}`)
			.then((res) => {
				if (res.data.status) {
					setValid(true);
				} else {
					setValid(false);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const HandleResetPassword = () => {
		console.log("hii");
		if (password !== conpassword) {
			showToast("error", "Password doesnt match");
		}
		users
			.post("/changepassword", { userId: userId, password: password })
			.then((res) => {
				if (res.data.status) {
					showToast("success", res.data.message + " redirecting to login");
					setTimeout(() => {
						Navigate("/login");
					}, 2000);
				}
			})
			.catch((error) => console.log(error));
	};
	return (
		<section className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${background})` }}>
			<div className="flex h-screen justify-center items-center">
				<div className="w-96 rounded-xl h-[300px] bg-gray-950 bg-opacity-80">
					{valid ? (
						<>
							{" "}
							<h1 className="text-center mb-10 text-white mt-2 font-bold text-4xl">Change Password</h1>
							<div className="flex">
								<input
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Password "
									className="mb-10 mx-auto bg-gray-700 text-white rounded-xl w-[350px]"
									type="password"
								/>
							</div>
							<div className="flex">
								<input
									value={conpassword}
									onChange={(e) => setConPassword(e.target.value)}
									placeholder="Confirm Password"
									className="mb-6 mx-auto bg-gray-700 text-white rounded-xl w-[350px]"
									type="password"
								/>
							</div>
							<div className="flex">
								<button
									onClick={HandleResetPassword}
									className="mx-auto text-white p-3 rounded-xl bg-blue-600">
									Reset My Password
								</button>
							</div>
						</>
					) : (
						<>
							<h1 className="text-center mb-10 text-white mt-2 font-bold text-4xl border-b p-5">
								Bad Token
							</h1>
							<h1 className="text-white w-full px-8">
								The password reset link was invalid, possibly because it has already been used. Please
								request{" "}
								<Link to={"/password/reset"}>
									<span className="text-blue-500 cursor-pointer"> a new password reset.</span>
								</Link>
							</h1>
						</>
					)}
				</div>
			</div>
		</section>
	);
};
export default ResetPassword;
