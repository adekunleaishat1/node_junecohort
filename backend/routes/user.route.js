const express = require("express")
const userrouter = express.Router()
const {Signup, Login, Verifytoken, UploadProfile, Verifymail} = require("../controller/user.controller")
const {uservalidation} = require("../middleware/user.validation")
const {Validateschema} = require("../middleware/validator")




userrouter.post("/signup" ,Validateschema(uservalidation), Signup)
userrouter.post("/login", Login)
userrouter.get("/verify", Verifytoken)
userrouter.patch("/upload/:userid", UploadProfile)
userrouter.get("/mail/:otp", Verifymail)


module.exports = userrouter