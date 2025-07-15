import React, {useState} from 'react'
import Input from '../Input'

const Login = () => {
   const [Formdetail, setformdetail] = useState({
          email:"",
          password:""
      })
      const HandleInputChange = (e) =>{
          const name = e.target.name
         setformdetail({...Formdetail, [name]:e.target.value})
        }
  return (
    <div>
       <Input HandleInputChange={HandleInputChange} type={"login"}/>
    </div>
  )
}

export default Login