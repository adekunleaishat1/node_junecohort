import React from 'react'

const Input = ({HandleInputChange, type, HandleClick, loading}) => {
   
  return (
    <div>
        <div className='w-50 mx-auto px-3 py-3 shadow '>
            <h1 className='text-center'>{type =="signup" ? "Sign Up" : "Login"}</h1>
            {type == "signup" &&
            
            <input name='username' className='form-control mt-3' onChange={HandleInputChange} type="text" placeholder='Username'/>}
       
        <input name='email' className='form-control mt-3' onChange={HandleInputChange} type="text" placeholder='Email' />
        <input name='password' className='form-control mt-3' onChange={HandleInputChange} type="text" placeholder='Password' />
        <button disabled={loading} onClick={HandleClick} className='btn btn-dark mt-3'>{loading ? "Loading..." :
         (type == "signup" )? "Signup" : "Login"
        }</button>
        </div>
    </div>
  )
}

export default Input