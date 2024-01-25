import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import { useLocation } from "react-router-dom";
import ChangePassword from "../Components/ChangePassword";
import AccountPrivacy from "../Components/AccountPrivacy";
import DeactivateAccount from "../Components/DeactivateAccount";

const Settings = () => {
	const location = useLocation();
	const isChangePassword = location.pathname.endsWith("/change-password");
	const isAccountPrivacy = location.pathname.endsWith("/account-privacy");
	const isDeactivateAccount = location.pathname.endsWith("/deactivate-account");

	return (
		<div className="flex">
			<div className="ml-80 w-[430px] h-screen border-r flex flex-col dark:bg-black">
				<h1 className="text-2xl dark:text-white text-black font-bold p-3">Settings</h1>
				<div className="flex mt-3 flex-col w-full">
					<Link
						to="/settings/change-password"
						className="mb-2 p-5 text-left dark:text-white text-black text-xl hover:bg-zinc-200 dark:hover:bg-zinc-800">
						Change Password
					</Link>
					<Link
						to="/settings/account-privacy"
						className="mb-2 text-left p-5 dark:text-white text-black text-xl hover:bg-zinc-200 dark:hover:bg-zinc-800">
						Account Privacy
					</Link>
					<Link
						to="/settings/deactivate-account"
						className="mb-2 text-left p-5 dark:text-white text-black text-xl hover:bg-zinc-200 dark:hover:bg-zinc-800">
						Deactivate your account
					</Link>
				</div>
			</div>
			<div className="flex-grow  dark:bg-black">
				{isChangePassword && <ChangePassword />}
				{isAccountPrivacy && <AccountPrivacy />}
				{isDeactivateAccount && <DeactivateAccount />}
			</div>
		</div>
	);
};

export default Settings;
