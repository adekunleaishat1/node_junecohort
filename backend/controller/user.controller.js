const usermodel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const saltRound = 10
const Signup = async (req,res) =>{
 try {
    console.log(req.body);
    const {username, email, password} = req.body
    if (!username || !email || !password) {
       return res.status(400).send({message:"All field are Mandatory", status:false})
    }
     const hashedpassword = await bcrypt.hash(password,saltRound )
     console.log(hashedpassword);
     
    const newuser = await usermodel.create({
      ...req.body,
      password:hashedpassword
    })
    if (!newuser) {
       return res.status(403).send({message:"Unable to create user", status:false})     
    }
    return res.status(200).send({message:"user created successfully", status:true})
    
 } catch (error) {
    console.log(error);
    if (error.message.includes("password: Cast to Number failed")) {
    return res.status(500).send({message:"Password must be a number", status:false})     
        
    }
    if (error.message.includes("E11000 duplicate key error")) {
    return res.status(500).send({message:"User already exist", status:false})     
        
    }
    return res.status(500).send({message:error.message, status:false})     
    
 }
}


const Login = async(req, res) =>{
   try {
      const {email, password} = req.body
      if (!email || !password) {
         res.status(406).send({message:"All fields are mandatory", status:false})
      }
     const existuser =  await usermodel.findOne({email})
     const correctpassword = await bcrypt.compare(password, existuser.password)
     console.log(correctpassword);
     
      
     if (existuser && correctpassword) {
        const token = await jwt.sign({email:existuser.email, id:existuser._id},process.env.SCERETKEY,{expiresIn:60})
         res.status(200).send({message:"Login successful", status:true, token})
     }
     
     if (!existuser || !correctpassword) {
         res.status(407).send({message:"Invalid email or password", status:false})
     }

   } catch (error) {
      console.log(error);
      
      return res.status(500).send({message:error.message, status:false})     
   }
}

const Verifytoken = async (req, res) =>{
   try {
      const token = req.headers.authorization.split(" ")[1]
      console.log(token);
      if (!token) {
         res.status(406).send({message:"Invalid Token", status:false})
         
      }
      const verified = await jwt.verify(token, process.env.SCERETKEY)    
       if (verified) {
        const user  = await usermodel.findOne({email:verified.email})
        return res.status(200).send({message:"token verified", user, status:true})
       }
       
   } catch (error) {
      console.log(error.message);
      return res.status(500).send({message:error.message, status:false})     
   }
}

module.exports = {Signup, Login, Verifytoken}