const usermodel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloudinary = require("../utils/cloudinary")
const SendVerificationMail = require("../utils/verificationMail")

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
     const otp = Math.floor( Math.random() * 1000 )
    const newuser = await usermodel.create({
      ...req.body,
      password:hashedpassword,
      otp
    })
    if (!newuser) {
       return res.status(403).send({message:"Unable to create user", status:false})     
    }
    const link = `http://localhost:8005/user/mail/${otp}`
     await SendVerificationMail(email, username,link)
    return res.status(200).send({message:"user created successfully,check your mail for verification.", status:true})
    
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

const Verifymail = async(req, res) =>{
  
   try {
      const {otp} = req.params
    const existuser =  await usermodel.findOneAndUpdate(
      { otp},
      {$set:{verified:true, otp:""}})

    if (existuser) {     
     res.render("verify", {message:`email verified successfully ${existuser.email}`}) 
    }
   } catch (error) {
    res.render("verify", {message:error.message}) 
   }
}


const Login = async(req, res) =>{
   try {
      const {email, password} = req.body
      if (!email || !password) {
       return  res.status(406).send({message:"All fields are mandatory", status:false})
      }
     const existuser =  await usermodel.findOne({email})
      if (!existuser) {
       return  res.status(407).send({message:"Invalid email or password", status:false})
     }
      const correctpassword = await bcrypt.compare(password, existuser.password)
      if (!correctpassword) {
        return res.status(407).send({message:"Invalid email or password", status:false})
     }
    
    if (existuser.verified == false) {
        return res.status(407).send({message:"Mail has not been verified.", status:false})
      
    }

        const token = await jwt.sign({email:existuser.email, id:existuser._id},process.env.SCERETKEY,{expiresIn:60})
        return res.status(200).send({message:"Login successful", status:true, token})
     
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


const UploadProfile = async (req, res) =>{
   try {
      const {userid} = req.params
      const {image } = req.body 
      if (!image) {
       return  res.status(406).send({message:"Add your profile picture", status:false})
      }

    const uploadimage = await cloudinary.uploader.upload(image)
    console.log(uploadimage.secure_url);
    if (uploadimage) {
        await usermodel.findByIdAndUpdate(
        userid,
        {$set:{profilePicture:uploadimage.secure_url}}
        )

     return  res.status(200).send({message:"profile picture uploaded", status:true})

    }
    
      
   } catch (error) {
      if (error.message.includes("request entity too large")) {
        return res.status(413).send({message:"Image should not exceed 5mb", status:false})        
      }
      return res.status(500).send({message:error.message, status:false})     
      
   }
}

module.exports = {Signup, Login, Verifytoken, UploadProfile, Verifymail}