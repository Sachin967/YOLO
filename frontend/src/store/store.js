import { configureStore } from "@reduxjs/toolkit";
import Authslice from "./Authslice";
import AdminSlice from "./Adminauthslice";

const Store = configureStore({
	reducer: { auth: Authslice.reducer, admin: AdminSlice.reducer },
	devTools: true
});

export default Store;
