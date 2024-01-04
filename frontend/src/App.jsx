import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoginANDSignup from "./Pages/LoginANDsignup";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SideBar from "./Components/sideBar";
import { useSelector } from "react-redux";
function App() {

	return (
		<>
			<ToastContainer toastStyle={{ backgroundColor: "crimson" }} />
			<Outlet />
		</>
	);
}

export default App;
