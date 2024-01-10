import { useState } from "react";
import { users } from "../config/axios";
import useCustomToast from "../toast";
import background from "../assets/bg.svg";
import { Link } from "react-router-dom";
const SendEmailToResetPass = () => {
	const [error, setError] = useState("");
	const [email, setEmail] = useState("");
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const showToast = useCustomToast();
	const HandleReset = () => {
		if (email === "") {
			setError("Required");
			return;
		}
		setButtonDisabled(true);
		users
			.post("/sendemail", { email: email })
			.then((res) => {
				console.log(res);
				if (res.data.status) {
					showToast("success", res.data.message);
				}
			})
			.catch((error) => console.log(error));
	};
	return (
		<section className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${background})` }}>
			<div className="flex h-screen justify-center items-center">
				<div className="w-96 h-[350px] bg-gray-950 bg-opacity-80 rounded-lg">
					<h1 className="text-center font-bold mt-2 mb-10 text-white text-4xl">Password Reset</h1>
					<div className={`text-center bg-green-400 mx-5 rounded-md ${error ? "mb-5" : "mb-10"}`}>
						Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing
						you to reset it.
					</div>
					<div className="flex justify-start ms-5">{error && <h1 className="text-red-700">{error}</h1>}</div>
					<div className="flex">
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email address"
							className=" bg-gray-700 mx-auto text-white rounded-xl w-[350px]"
							type="email"
						/>
					</div>
					<div className="flex justify-start">
						{!buttonDisabled && (
							<button onClick={HandleReset} className="ms-5 my-5 p-3 rounded-xl text-white bg-blue-600">
								Reset My Password
							</button>
						)}
						<Link
							to="/login"
							className=" ms-24 font-semibold text-blue-800  text-primary-600 hover:underline dark:text-primary-500">
							Login here
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};
export default SendEmailToResetPass;
