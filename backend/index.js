const express = require("express")
const app = express()
const env = require("dotenv").config()
const connect = require("./Dbconfig/db.connect")
const cors = require("cors")
const ejs = require("ejs")
const userrouter = require("./routes/user.route")
const {errorhandler} = require("./middleware/errorhandler")


app.use(cors({origin:"*"}))
app.use(express.json({limit:"50mb"}))
app.use("/user", userrouter)
app.use(errorhandler) 
app.set("view engine", "ejs")


connect()

const port = 8005
app.listen(port,()=>{
  console.log(`app stated at port ${port}`)
  
})






