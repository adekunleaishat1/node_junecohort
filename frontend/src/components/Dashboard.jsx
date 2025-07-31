import axios from 'axios'
import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
const baseUrl = import.meta.env.VITE_API_BASE_URL

const Dashboard = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [image, setimage] = useState("")
     const user = JSON.parse(localStorage.getItem("current_User"))
     const [productDetails, setproductDetails] = useState({
      name:"",
      price:"",
      description:"",
      stock:"",
      image:[]
     })
   useEffect(() => {
      axios.get(`${baseUrl}/user/verify`,{
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
    
    axios.patch(`${baseUrl}/user/upload/${user._id}`,{image})
    .then((res)=>{
        console.log(res);
        
    }).catch((err)=>{
        console.log(err);
        
    })
   }


   const handleinputchange = (e) =>{
    // console.log(e.target.value); console.log(e.target.name);
    setproductDetails({...productDetails, [e.target.name]:e.target.value})
    

   }
   const handlefilechange = (e) =>{
    const imagefiles = e.target.files
    let filereaders = []
    Array.from(imagefiles).map((image)=>{
      let reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = (e) =>{
       filereaders.push(e.target.result)
         setproductDetails({...productDetails, image:filereaders})
      }
    })
    
   }

   const Uploadproduct = () =>{
    console.log(productDetails);
     axios.post(`${baseUrl}/product/add`,productDetails)
    .then((res)=>{
        console.log(res);
        
    }).catch((err)=>{
        console.log(err);
        
    })
   }
  return (
    <div>
        <img src={user && user.profilePicture} alt="" />
          <input onChange={HandleFileChange} type="file" />
          <button onClick={Uploadprofile}>upload</button>




          <div>
            <input name='name' onChange={handleinputchange} placeholder='Product Name' type="text" />
            <input name='price' onChange={handleinputchange} placeholder='Product Price' type="number" />
            <input name='description' onChange={handleinputchange} placeholder='Product Description' type="text" />
            <input name='stock' onChange={handleinputchange} placeholder='Product stock' type="number" />
            <input name='image' onChange={handlefilechange} placeholder='Product Image' type="file" multiple />
            <button onClick={Uploadproduct}>Upload Product</button>
          </div>
    </div>
  )
}

export default Dashboard