import { Avatar } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "../API/api";
import { useNavigate } from "react-router-dom";

const Suggesions = ({notfollowers}) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {userdetails}=useSelector(state=>state.auth)
  return <div className="sm:block hidden w-[370px]  border-gray-700 bg-white dark:bg-black">
    <div className="flex mt-8 ml-3 p-2">
      <Avatar src={userdetails?.propic?.url}></Avatar>
      <div className="flex flex-col w-full ms-4 ">
        <h1 className="dark:text-white font-semibold  text-black">{userdetails?.name}</h1>
        <h1 className="dark:text-gray-400 text-gray-700">{userdetails?.username}</h1>
      </div>
      <button onClick={()=>handleLogout(dispatch,Navigate)} className="mr-3 text-red-600 text-sm">Logout</button>
    </div>
    <div className="mt-5">
      <h1 className="ms-4 my-3 font-bold text-base text-black dark:text-white">Suggested for you</h1>
      {notfollowers.map((user) => {
        return <div key={user._id} className="flex  ml-3 p-1">
          <Avatar src={user?.propic?.url}></Avatar>
          <div className="flex flex-col w-full ms-4 text-sm">
            <h1 className="dark:text-white  font-semibold  text-black">{user?.name}</h1>
            <h1 className="dark:text-gray-400 text-gray-700">{user?.username}</h1>
          </div>
          <button className="mr-3 text-purple-600 text-sm">Follow</button>
        </div>
      })}
    </div>
  </div>
};
export default Suggesions;
