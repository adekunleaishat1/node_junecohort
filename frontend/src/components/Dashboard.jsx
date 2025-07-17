import axios from 'axios'
import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [image, setimage] = useState("")
     const user = JSON.parse(localStorage.getItem("current_User"))
   useEffect(() => {
      axios.get("http://localhost:8005/user/verify",{
        headers:{
            "Authorization": `bearer ${token}`
        }
      }).then((res)=>{
        console.log(res.data.user);
        localStorage.setItem("current_User", JSON.stringify({...res.data.user, password:""}))
      }).catch((err)=>{
        if(err.response.data.message == "jwt expired"){
            navigate("/login")
        }
      })
   }, [])

   const HandleFileChange = (e) =>{
      const imagefile = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(imagefile)
      reader.onload = (e) =>{
        console.log(e.target.result);
        setimage(e.target.result)
      }
   }
   const Uploadprofile = () =>{
    const user = JSON.parse(localStorage.getItem("current_User"))
    console.log(user._id);
    
    axios.patch(`http://localhost:8005/user/upload/${user._id}`,{image})
    .then((res)=>{
        console.log(res);
        
    }).catch((err)=>{
        console.log(err);
        
    })
   }
  return (
    <div>
        <img src={user.profilePicture} alt="" />
          <input onChange={HandleFileChange} type="file" />
          <button onClick={Uploadprofile}>upload</button>
    </div>
  )
}

export default Dashboard