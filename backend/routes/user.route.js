const express = require("express")
const userrouter = express.Router()
const {Signup, Login, Verifytoken, UploadProfile} = require("../controller/user.controller")




userrouter.post("/signup", Signup)
userrouter.post("/login", Login)
userrouter.get("/verify", Verifytoken)
userrouter.patch("/upload/:userid", UploadProfile)


module.exports = userrouter