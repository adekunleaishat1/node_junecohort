const express = require("express")
const userrouter = express.Router()
const {Signup, Login, Verifytoken} = require("../controller/user.controller")




userrouter.post("/signup", Signup)
userrouter.post("/login", Login)
userrouter.get("/verify", Verifytoken)


module.exports = userrouter