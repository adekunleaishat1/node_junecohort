const usermodel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloudinary = require("../utils/cloudinary")
const SendVerificationMail = require("../utils/verificationMail")

const saltRound = 10
const Signup = async (req,res, next) =>{
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
    const baseurl = process.env.API_URL
    const link = `${baseurl}/user/mail/${otp}`
     await SendVerificationMail(email, username,link)
    return res.status(200).send({message:"user created successfully,check your mail for verification.", status:true})
    
 } catch (error) {
    console.log(error);
   //  console.log("error name",error.name);
   //  console.log("error code",error.code);
    next(error)
   //  return res.status(500).send({message:error.message, status:false})     
    
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


const Login = async(req, res, next) =>{
   try {
     
      const {email, password} = req.body

      if (!email || !password) {
          console.log("checking for empty input field");
       return res.status(406).send({message:"All fields are mandatory", status:false})
      }

     const existuser =  await usermodel.findOne({email})
     console.log(existuser, "exist user detail");
     
      if (!existuser) {
       return res.status(405).send({message:"Invalid email or password", status:false})
     }

     console.log("checking for correctpassword detail");
        
      const correctpassword = await bcrypt.compare(password, existuser.password)

       console.log(correctpassword, "checking for correctpasword detail");

      if (!correctpassword) {
         
         console.log("return an error if the password is not correct");  
         return res.status(407).json({message:"Invald email or password", status:false})  
     }
     console.log("checking if the user has been verified");
     console.log(existuser.verified);
     
    if (existuser.verified == false) {
        return res.status(409).send({message:"Mail has not been verified.", status:false})
    }
    
      const token = await jwt.sign({email:existuser.email, id:existuser._id},process.env.SCERETKEY,{expiresIn:'1d'})

      return res.status(200).json({message:"Login successful", status:true, token})
     
   } catch (error) {
      console.log(error,"Error coming from the server");
      next(error)
      // return res.status(500).send({message:error.message, status:false})     
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