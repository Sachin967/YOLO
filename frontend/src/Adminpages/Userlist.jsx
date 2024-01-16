import { admin } from "../config/axios";
import { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
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
		}
	};
	const imageBodyTemplate = (user) => {
		return (
			<img
				src={
					user.propic?.url ||
					"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
				}
				alt={"No Image"}
				className="w-12 rounded-full shadow-2 border-round"
			/>
		);
	};
	const actionTem = (user) => {
		return (
			<button
				onClick={() => handleUserblock(user)}
				className={`font-bold w-20  ${user.isBlocked ? "text-blue-600" : "text-red-600"}`}>
				{user.isBlocked ? "Unblock" : "Block"}
			</button>
		);
	};

	return (
		<div className="card bg-black">
			<h1 className="text-center text-black font-bold text-3xl py-3">Users List</h1>
			<div className="flex h-screen">
				<DataTable
					className="w-[79rem] overflow-hidden rounded-3xl mx-auto"
					paginator
					rows={5}
					rowsPerPageOptions={[5, 10, 25, 50]}
					value={users}
					tableStyle={{ minWidth: "50rem" }}>
					<Column className="border-b border-l text-white" header="Image" body={imageBodyTemplate}></Column>
					<Column className="border-b" field="name" header="Name"></Column>
					<Column className="border-b" field="username" header="Username"></Column>
					<Column className="border-b" field="email" header="Email"></Column>
					<Column className="border-b border" header="Action" body={actionTem}></Column>
				</DataTable>
			</div>
		</div>
		//
	);
};
export default Userlist;
