import React, {useState} from 'react'
import Input from '../Input'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
   const [loading , setLoading] = useState(false)
   const [Formdetail, setformdetail] = useState({
          email:"",
          password:""
      })
      const HandleInputChange = (e) =>{
          const name = e.target.name
         setformdetail({...Formdetail, [name]:e.target.value})
        }
        
        const Loginuser = () =>{
            axios.post("http://localhost:8005/user/login",Formdetail)
        .then((res)=>{
            console.log(res);
            localStorage.setItem("token", res.data.token)
            navigate("/dashboard")
        }).catch((err)=>{
            console.log(err);
            
        }).finally(()=>{
              setLoading(false)
      })
        }
  return (
    <div>
       <Input HandleInputChange={HandleInputChange} type={"login"} HandleClick={Loginuser} loading={loading}/>
    </div>
  )
}

export default Login