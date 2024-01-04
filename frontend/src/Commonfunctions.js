import { users } from "./config/axios";
import { AuthActions } from "./store/Authslice";
export const Error403 = (error, showToast,dispatch,Navigate) => {

	showToast("error", error.response.data.message);

	setTimeout(() => {
		users.post("/logout").then((res) => {
			if (res.status) {
				dispatch(AuthActions.UserLogout());
				Navigate("/login");
			}
		});
	}, 2000);
};
