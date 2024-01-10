import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider, useSelector } from "react-redux";
import Store from "./store/store.js";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import LoginANDSignup from "./Pages/LoginANDsignup.jsx";
import Home from "./Pages/Home.jsx";
import PostModal from "./Components/Modals/PostModal.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import AdminLogin from "./Adminpages/AdminLogin.jsx";
import UserPrivateRoute from "./PrivateRoutes/UserPrivateRoute.jsx";
import { AdminPrivateRoute } from "./PrivateRoutes/AdminPrivateRoute.jsx";
import Userlist from "./Adminpages/Userlist.jsx";
import PostList from "./Adminpages/PostList.jsx";
import { modalTheme } from "./config/ChakraModalconfig.js"; // Replace with the correct path
import Profile from "./Pages/Profile.jsx";
import UsersProfile from "./Pages/UsersProfile.jsx";
import Notification from "./Pages/Notification.jsx";
import Message from "./Pages/Message.jsx";
import ChatProvider from "./Context/ChatProvider.jsx";
import Bookmark from "./Pages/Bookmark.jsx";
import VideoRoom from "./Pages/VideoRoom.jsx";
import SendEmailToResetPass from "./Components/SendEmailToResetPass.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import AdminDashboard from "./Adminpages/AdminDashboard.jsx";
const theme = extendTheme({
	components: {
		Modal: {
			...modalTheme // Integrate the modalTheme configuration into the Modal component
		}
	}
	// Other theme configurations
});

export default theme;
const routes = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<App />}>
				<Route path="/login" element={<LoginANDSignup />} />
				<Route path="/signup" element={<LoginANDSignup />} />
				<Route path="/verifyOtp/:id" element={<LoginANDSignup />} />
				<Route path="/password/reset" element={<SendEmailToResetPass />} />
				<Route path="/reset-password/:token/:userId" element={<ResetPassword />} />
				<Route path="/admin/login" element={<AdminLogin />} />
				{/* User Routes */}
				<Route path="/" element={<UserPrivateRoute />}>
					<Route path="/" element={<Navigate to="/home" />} />
					<Route path="/home" element={<Home />} />
					<Route path="/post" element={<PostModal />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/:username" element={<UsersProfile />} />
					<Route path="/notifications" element={<Notification />} />
					<Route path="/messages" element={<Message />} />
					<Route path="/messages/:userId" element={<Message />} />
					<Route path="/:username/saved" element={<Bookmark />} />
					<Route path="/room/:userId" element={<VideoRoom />} />
				</Route>
				{/* Admin Routes */}
				<Route path="/admin" element={<AdminPrivateRoute />}>
					<Route path="/admin" element={<AdminDashboard />}></Route>
					<Route path="/admin/users" element={<Userlist />} />
					<Route path="/admin/posts" element={<PostList />} />
				</Route>
			</Route>
		</>
	)
);

ReactDOM.createRoot(document.getElementById("root")).render(
	<ChatProvider>
		<Provider store={Store}>
			<ChakraProvider theme={theme}>
				<RouterProvider router={routes} />
			</ChakraProvider>
		</Provider>
	</ChatProvider>
);
