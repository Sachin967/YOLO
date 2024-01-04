import background from "../assets/bg.svg";
import { useLocation } from "react-router-dom";
import Login from "../Components/login";
import Signup from "../Components/Signup";
import Otp from "../Components/Otp";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
const LoginANDSignup = () => {
	const location = useLocation();
	const isLogin = location.pathname.startsWith("/login");
	const isSignup = location.pathname.startsWith("/signup");
	const isOtp = location.pathname.startsWith("/verifyOtp");
	return (
		<>
			
			<section className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${background})` }}>
				{isLogin && <Login />}
				{isOtp && <Otp />}
				{isSignup && <Signup />}
			</section>
		</>
	);
};
export default LoginANDSignup;
