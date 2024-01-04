import { createSlice } from "@reduxjs/toolkit";

// Retrieve admin details from local storage if available
const adminDetailsFromLocalStorage = localStorage.getItem("adminDetails")
	? JSON.parse(localStorage.getItem("adminDetails"))
	: null;

const AdminSlice = createSlice({
	name: "Admin",
	initialState: {
		Adminisloggedin: !!adminDetailsFromLocalStorage,
		adminDetails: adminDetailsFromLocalStorage ? [adminDetailsFromLocalStorage] : []
	},
	reducers: {
		AdminLogin(state, action) {
			state.Adminisloggedin = true;
			state.adminDetails = action.payload;
			localStorage.setItem("adminDetails", JSON.stringify(action.payload));
		},
		AdminLogout(state) {
			state.Adminisloggedin = false;
			state.adminDetails = [];
			localStorage.removeItem("adminDetails");
		}
	}
});

// Export actions of the Admin slice {AdminLogin, AdminLogout, ... etc.}
export const AdminActions = AdminSlice.actions;

// Export the whole Admin slice to configure the store in store.js
export default AdminSlice;
