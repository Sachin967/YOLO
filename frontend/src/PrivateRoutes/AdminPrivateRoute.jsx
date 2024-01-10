import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import AdminSidebar from "../AdminComponents/adminSidebar";
export const AdminPrivateRoute = () => {
	const { Adminisloggedin } = useSelector((state) => state.admin);
	console.log(Adminisloggedin);
	return Adminisloggedin ? (
		<>
			<AdminSidebar />
			<Outlet />
		</>
	) : (
		<Navigate to="/admin/login" replace />
	);
};
