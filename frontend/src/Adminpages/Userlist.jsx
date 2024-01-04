import { admin } from "../config/axios";
import { useState, useEffect } from "react";
const Userlist = () => {

const [users, setUserData] = useState([]);
async function getUsersFromBackend() {
	try {
		const response = await admin.get("/getUsers");
		if (response) {
			// console.log(response.data)
			setUserData(response.data);
		}
	} catch (error) {
		console.error(error);
	}
}

// Trigger the getUsersFromBackend function in a useEffect hook
useEffect(() => {
	getUsersFromBackend();
}, []);

const handleUserblock = async (user) => {
	try {
		if (user.isBlocked) {
			const response = await admin.post("/unblockuser", { id: user._id });
			if (response.data) {
				console.log(response.data);
				// toast.success("User unblocked successfully.");
				// Update the guideData state to reflect the change in the UI
				setUserData((prevData) => {
					const updatedData = prevData.map((usr) =>
						usr._id === user._id ? { ...usr, isBlocked: false } : usr
					);
					return updatedData;
				});
			}
		} else {
			const response = await admin.post("/blockuser", { id: user._id });
			if (response.data) {
				// toast.success("User blocked successfully.");
				// Update the guideData state to reflect the change in the UI
				setUserData((prevData) => {
					const updatedData = prevData.map((usr) =>
						usr._id === user._id ? { ...usr, isBlocked: true } : usr
					);

					return updatedData;
				});
			}
		}
	} catch (err) {
		console.log(err);
		// toast.error(err?.data?.message || err?.error);
	}
};

return (
	<div className="relative overflow-x-auto p-12 sm:rounded-lg min-h-screen bg-gray-900 text-white">
		<h1 className="text-center text-3xl py-3">Users List</h1>
		<table className="w-full border-4 border-gray-700 text-sm text-left rtl:text-right">
			<thead className="text-xs uppercase bg-gray-800">
				<tr>
					<th scope="col" className="px-6 py-3">
						Name
					</th>
					<th scope="col" className="px-6 py-3">
						Username
					</th>
					<th scope="col" className="px-6 py-3">
						Email
					</th>
					<th scope="col" className="px-6 py-3">
						Image
					</th>
					<th scope="col" className="px-6 py-3">
						Action
					</th>
				</tr>
			</thead>
			<tbody>
				{users.map((user, index) => (
					<tr key={index} className="bg-gray-700">
						<td className="px-6 py-4">{user.name}</td>
						<td className="px-6 py-4">{user?.username}</td>
						<td className="px-6 py-4">{user?.email}</td>
						<td className="px-6 py-4">
							<img className="w-24 h-24" src={user?.propic?.url} alt="No Image" />
						</td>
						<td className="px-6 py-4">
							<button
								onClick={() => handleUserblock(user)}
								className="font-medium text-blue-400 hover:text-blue-300">
								{user.isBlocked ? "Unblock" : "Block"}
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);
};
export default Userlist;
