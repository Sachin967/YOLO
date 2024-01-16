import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { FaWallet } from "react-icons/fa";
import { MdFavorite, MdHelp } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { admin } from "../config/axios";
import { AdminActions } from "../store/Adminauthslice";
import { Button } from "flowbite-react";
import { useDispatch } from "react-redux";
const Navbar = () => {
	const location = useLocation();
	const isPostlist = location.pathname.startsWith("/admin/posts");
	const Navigate = useNavigate();
	const dispatch = useDispatch();
	const [nav, setNav] = useState(false);
	const handleLogout = () => {
		admin.post("/logout").then((res) => {
			if (res.status) {
				dispatch(AdminActions.AdminLogout());
				Navigate("/admin/login");
			}
		});
	};

	const menuItems = [
		{ icon: < MdDashboard  size={25} className="mr-4" />, text: "Dashboard", link: "/admin/" },
		{ icon: <TbTruckDelivery size={25} className="mr-4" />, text: "Users", link: "/admin/users" },
		{ icon: <MdFavorite size={25} className="mr-4" />, text: "Flagged Posts", link: "/admin/posts" },
		{ icon: <FaWallet size={25} className="mr-4" />, text: "Problems" }
	];

	return (
		<div
			className="max-w-[1640px] mx-auto bg-zinc-800 flex justify-between items-center p-4 shadow-sm">
			{/* Left side */}
			<div className="flex items-center">
				<div onClick={() => setNav(!nav)} className="text-gray-400 cursor-pointer">
					<AiOutlineMenu size={30} />
				</div>
				<h1 className="text-2xl text-gray-400 sm:text-3xl lg:text-4xl px-2">
					<span className="font-bold">YOLO</span>
				</h1>
			</div>
			{/* Search Input */}
			{/* <div className="bg-gray-500 rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[500px]">
				<AiOutlineSearch size={25} />
				<input className="bg-gray-500 rounded-xl p-2 w-full" type="text" placeholder="" />
			</div> */}
			{/* Cart button */}
			{/* <button className="bg-black text-white hidden md:flex items-center py-2 rounded-full border border-black px-5 ">
				<BsFillCartFill size={20} className="mr-2" /> Cart
			</button> */}

			{/* Mobile Menu */}
			{/* Overlay */}
			{nav ? <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div> : ""}

			{/* Side drawer menu */}
			<div
				className={
					nav
						? "fixed top-0 left-0 w-[300px] h-screen bg-zinc-800 z-10 duration-300"
						: "fixed top-0 left-[-100%] w-[300px] h-screen bg-black z-10 duration-300"
				}>
				<AiOutlineClose
					onClick={() => setNav(!nav)}
					size={30}
					className="absolute right-4 hover:text-white top-4 cursor-pointer"
				/>
				<h2 className="text-2xl text-gray-300 p-4">
					<span className="font-bold">YOLO</span>
				</h2>
				<nav>
					<ul className="flex flex-col p-4 text-gray-500">
						{menuItems.map(({ icon, text, link }, index) => {
							return (
								<div key={index} className=" py-4">
									<li className="text-lg flex cursor-pointer  w-[50%] rounded-full mx-auto p-2 text-white hover:text-black hover:font-bold">
										<Link className="flex items-center" to={link}>
											{icon} {/* Assuming 'icon' is an SVG or icon component */}
											<span className="ml-2">{text}</span>
										</Link>
									</li>
								</div>
							);
						})}
						<li>
							<Button className="bg-gray-700 mx-auto mt-5" onClick={handleLogout}>
								Logout
							</Button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
