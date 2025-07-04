const mongoose = require("mongoose")

const userschema = mongoose.Schema({
 username:{type:String,trim:true,required:true},
 email:{type:String,trim:true, required:true, unique:true},
 password:{type:Number,trim:true, required:true},
 profilePicture:{type:String,}
},{timestamp:true})

const usermodel = mongoose.model("user_collection", userschema)


module.exports = usermodel