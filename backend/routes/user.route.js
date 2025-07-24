const express = require("express")
const userrouter = express.Router()
const {Signup, Login, Verifytoken, UploadProfile, Verifymail} = require("../controller/user.controller")




userrouter.post("/signup", Signup)
userrouter.post("/login", Login)
userrouter.get("/verify", Verifytoken)
userrouter.patch("/upload/:userid", UploadProfile)
userrouter.get("/mail/:otp", Verifymail)


module.exports = userrouter