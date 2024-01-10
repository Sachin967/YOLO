import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { users } from "../config/axios";
import { AuthActions } from "../store/Authslice";
import { useDispatch } from "react-redux";
import useCustomToast from "../toast";

const Otp = () => {
	const showToast = useCustomToast();
	const Dispatch = useDispatch();
	const Navigate = useNavigate();
	const [secondsRemaining, setSecondsRemaining] = useState(60); // State to hold remaining seconds
	const [resendDisabled, setResendDisabled] = useState(false); // State to control button disabled state
	const { id } = useParams();
	const [otp, setOtp] = useState();
	const data = {
		otp: otp,
		id: id
	};
	const handleRegister = (e) => {
		e.preventDefault();
		users
			.post("/verifyOtp", data)
			.then((res) => {
				if (res.data.status) {
					Dispatch(AuthActions.Userlogin(res.data));
					Navigate("/");
				} else {
					showToast("error", "Recheck Otp");
				}
			})
			.catch((err) => {
				console.log(err);
				showToast("error", "Check Otp");
			});
	};
	const ResendOtp = () => {
		users.post("/resendotp", { id: data.id }).then((response) => {
			if (response.statusText == "OK") {
				startOTPTimer();
				setResendDisabled(true);
			}
		});
	};
	// Function to start the timer for OTP resend
	const startOTPTimer = () => {
		const resendInterval = 60; // Interval in seconds (e.g., 60 seconds)

		let countdown = resendInterval;
		setSecondsRemaining(countdown);

		const timer = setInterval(() => {
			countdown -= 1;
			setSecondsRemaining(countdown);

			if (countdown === 0) {
				clearInterval(timer); // Clear the timer when countdown reaches 0
				setResendDisabled(false); // Enable the Resend OTP button
			}
		}, 1000);
	};

	const manuallyResendOTP = (e) => {
		e.preventDefault();
		ResendOtp(); // Call the function to send OTP immediately
	};

	return (
		<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
			<a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"></a>
			<div className="w-full bg-gray-950 bg-opacity-80 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
						Verification Code
					</h1>
					<form className="space-y-4 md:space-y-6">
						<div>
							<label
								htmlFor="otp"
								className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
								Enter the verification code sent to your email {}
							</label>
							<input
								onChange={(e) => setOtp(e.target.value)}
								type="number"
								name="otp"
								id="otp"
								className="bg-gray-700  text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder=""
								required=""
							/>
						</div>
						<button
							onClick={(e) => handleRegister(e)}
							type="submit"
							className="w-full text-white border-slate-950 bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
							Verify
						</button>
						<button className={`${resendDisabled?'text-gray-600':'text-white'}`} onClick={manuallyResendOTP} disabled={resendDisabled}>
							Resend OTP {resendDisabled && `(${secondsRemaining}s)`}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Otp;
