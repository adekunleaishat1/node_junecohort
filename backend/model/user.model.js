
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userschema = mongoose.Schema({
 username:{type:String,trim:true,required:true},
 email:{type:String,trim:true, required:true, unique:true},
 password:{type:String,trim:true, required:true},
 profilePicture:{type:String,}
},{timestamp:true})


// userschema.pre("save",async function (next) {
//       console.log(this, "all information");
//       try {
//       const hashedpassword =  await bcrypt.hash(this.password, 10)
//       this.password = hashedpassword
//       next()
//       } catch (error) {
//         console.log(error);
        
//       }
      
// })

const usermodel = mongoose.model("user_collection", userschema)





module.exports = usermodel