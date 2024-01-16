import { Outlet, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<>
			<ToastContainer toastStyle={{ backgroundColor: "crimson" }} />
			<Outlet />
		</>
	);
}

export default App;
