import { useState } from "react";
import useCustomToast from "../config/toast";
import { users } from "../config/axios";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const showToast = useCustomToast()
  // const {userdetails}=useSelector((state)=>state.auth)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'currentPassword':
        setcurrentPassword(value);
        break;
      case 'newPassword':
        setnewPassword(value);
        break;
      case 'confirmPassword':
        setconfirmPassword(value);
        break;
      default:
    }
  }
  const handleChangePassword = () => {
    if (currentPassword.length < 6 || newPassword.length < 6 || confirmPassword.length < 6) {
      showToast('error', 'Your password needs to be at least 6 characters. Please enter a longer one.')
      return
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match.')
      return
    }
    users.put('/password',{currentPassword,newPassword}).then(res=>{
      console.log(res.data)
      if(res.data.status===true){
        setcurrentPassword('')
        setnewPassword('')
        setconfirmPassword('')
        showToast('success',res.data.message)
      }else{
        showToast('error',res.data.message)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  return <div className="flex flex-col items-center">
    <div className="flex justify-center mt-5">
      <h1 className="dark:text-white text-black font-bold text-2xl">Change your password</h1>
    </div>
    <div className="w-[650px]">
      <div className="flex flex-col justify-center mt-10">
        <div className="mb-7 border-b border-gray-500 w-auto">
          <input
            value={currentPassword}
            onChange={handleInputChange}
            name="currentPassword"
            type="password"
            className="bg-transparent rounded-xl text-white p-4 mb-7 w-full"
            placeholder="Current Password"
          />
        </div>
        <div className="mb-8  w-full">
          <input
            value={newPassword}
            onChange={handleInputChange}
            type="password"
            name="newPassword"
            className="bg-transparent text-white rounded-xl p-4 w-full"
            placeholder="New Password"
          />
        </div>
        <input
          value={confirmPassword}
          name="confirmPassword"
          onChange={handleInputChange}
          type="password"
          className="bg-transparent text-white rounded-xl p-4 w-full"
          placeholder="Confirm Password"
        />
      </div>
    </div>
    <button disabled={!currentPassword || !newPassword || !confirmPassword} onClick={handleChangePassword} className="mt-5 mr-5 p-2 w-28 rounded-3xl text-white font-bold disabled:text-gray-600 bg-purple-600 disabled:bg-purple-900">Save</button>
  </div>


};
export default ChangePassword;
