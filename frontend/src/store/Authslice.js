import { createSlice } from "@reduxjs/toolkit";

const userDetailsFromLocalStorage = localStorage.getItem("userdetails")
	? JSON.parse(localStorage.getItem("userdetails"))
	: null;
const Authslice = createSlice({
	name: "Auth",
	initialState: {
		Userisloggedin: !!userDetailsFromLocalStorage,
		userdetails: userDetailsFromLocalStorage ? userDetailsFromLocalStorage : []
	},
	reducers: {
		Userlogin(state, action) {
			state.Userisloggedin = true;
			state.userdetails = action.payload;
			localStorage.setItem("userdetails", JSON.stringify(action.payload));
		},
		Userupdate(state, action) {
			state.Userisloggedin = true;
			state.userdetails = action.payload;
			localStorage.setItem("userdetails", JSON.stringify(action.payload));
		},
		UserLogout(state) {
			state.Userisloggedin = false;
			state.userdetails = [];
			localStorage.removeItem("userdetails");
		}
	}
});

export const AuthActions = Authslice.actions;

export default Authslice;
