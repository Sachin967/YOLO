import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import SideBar from "../Components/SideBar.jsx";

const UserPrivateRoute = () => {
	const { Userisloggedin, userdetails } = useSelector((state) => state.auth);
	return Userisloggedin ? (
		<>
			<SideBar userinfo={userdetails} />
			<Outlet />
		</>
	) : (
		<Navigate to="/login" replace />
	);
};
export default UserPrivateRoute;
