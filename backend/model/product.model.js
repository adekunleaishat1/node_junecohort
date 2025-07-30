
const mongoose = require("mongoose")


const productschema = mongoose.Schema({
 name:{type:String,trim:true,required:true},
 price:{type:Number,trim:true, required:true,},
 description:{type:String,trim:true, required:true},
 stock:{type:Number, required:true},
 images:{type:[String], required:true},
},{timestamp:true})


const productmodel = mongoose.model("products", productschema)
module.exports = productmodel