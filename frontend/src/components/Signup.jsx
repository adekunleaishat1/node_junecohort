import { useState } from 'react'
import axios from 'axios'
import Input from '../Input'

const Signup = () => {
    const [Formdetail, setformdetail] = useState({
        username:"",
        email:"",
        password:""
    })
    const [loading , setLoading] = useState(false)

    const HandleInputChange = (e) =>{
        const name = e.target.name
       setformdetail({...Formdetail, [name]:e.target.value})
      }
      const Handlesubmit = () =>{
        console.log(Formdetail);
        setLoading(true)
        axios.post("http://localhost:8005/user/signup",Formdetail)
        .then((res)=>{
            console.log(res);
            
        }).catch((err)=>{
            console.log(err);
            
        }).finally(()=>{
              setLoading(false)
      })
    }
  return (
    <div>
        <Input HandleInputChange={HandleInputChange} type={"signup"} HandleClick={Handlesubmit} loading={loading}/>
       
    </div>
  )
}

export default Signup