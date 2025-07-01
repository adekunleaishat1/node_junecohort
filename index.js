const express = require("express")
const app =  express()
const ejs = require("ejs")
const mongoose = require("mongoose")
require("dotenv").config()
const connect = require("./Dbconfig/db.connect")

app.set("view engine", "ejs")
app.use(express.urlencoded())

// CRUD CREATE READ UPDATE DELETE
const userschema = mongoose.Schema({
 username:{type:String,trim:true,required:true},
 email:{type:String,trim:true, required:true, unique:true},
 password:{type:Number,trim:true, required:true},
 profilePicture:{type:String,}
},{timestamp:true})

const usermodel = mongoose.model("user_collection", userschema)
// TODO
const todoSchema = mongoose.Schema({
title : {type:String, trim: true ,required:true},
description : {type:String, trim: true ,required:true}
})
const todomodel = mongoose.model("todo_collection" , todoSchema)
  
//shopping-list
//shopping schema
const shoppingSchema = mongoose.Schema({
  itemType: {type: String, trim: true,required: true},
  itemPrice: {type: String, trim: true,required: true},
  itemQuantity: {type: String, trim: true,required: true},
  total: {type: String, trim: true,required: true},
  completed:{type:Boolean, default:false}
})
 const shoppingModel = mongoose.model("shopping-list", shoppingSchema)
 app.post("/shopping-list", async (req, res)=>{
  console.log(req.body);
  
  const list = {itemType,itemPrice,itemQuantity,total} = req.body
  console.log(list);
  try {
    const shopping = await shoppingModel.create({itemType,itemPrice,itemQuantity,total})
    console.log(shopping);
    
  } catch (error) {
    console.log(error);
    
  }
  res.redirect("/shopping-list")
 })
 app.post("/shoppingupdate/:id",async(req, res)=>{
try {
  const {id} = req.params
  const {completed} = req.body
  let shops = await shoppingModel.findOne({_id:id})
 console.log(id);
 console.log(shops);
 
 
  if (shops.completed == true) {
    await shoppingModel.findByIdAndUpdate(
      id,
      { completed:false, new:true})
    res.redirect('/shopping-list')
  }else{
   const myshop=  await shoppingModel.findByIdAndUpdate( 
    id,
    {completed:true, new:true}
  )
    console.log(myshop);
    
   res.redirect('/shopping-list')

  }

} catch (error) {
  console.log(error);
  
}
 })
 app.get("/shopping-list",async(req, res)=>{
  try {
    let shopping =  await shoppingModel.find()
    res.render("shopping-list", {shopping})
  } catch (error) {
    console.log(error);
    
    
  }
 })


// pust to database

const allUser = []

const todo = []
let errormessage = ""

app.get("/",(request, response)=>{
  //   response.send("Welcome To your Node Class")
   response.render("index",{name:"Shola"})
})


app.get("/signup",(req, res)=>{
    res.render("signup",{errormessage})
})

app.get("/login",(req, res)=>{
   res.render("login")
})

app.get("/todo/edit/:id", async(req, res)=>{
try {
  console.log(req.params);
  const {id} = req.params
   const onetodo = await todomodel.findById(id)
   console.log(onetodo);
   
  res.render("edit",{onetodo})
} catch (error) {
  
}
})


app.get("/todo", async (req, res)=>{
  try {
    let todo = await todomodel.find()
    console.log(todo);
  res.render("todo",{todo})

    
  } catch (error) {
    console.log(error); 
    
  }
})
app.post('/user/todo', async (req,res)=>{
  try {
    const createtodo = await todomodel.create(req.body)
    console.log(createtodo);
    if (createtodo) {
      res.redirect("/todo")
    }
  } catch (error) {
    console.log(error.message);
  }
})


app.post("/todo/delete", async(req, res)=>{
try {
  console.log(req.body);
 const {id} = req.body
 const deletedTodo =  await todomodel.findByIdAndDelete(id)
  if (deletedTodo) {
    res.redirect("/todo")
  }
} catch (error) {
  console.log(error);
  res.redirect("/todo")
}
})

app.post("/todo/update/:id", async(req,res)=>{
 try {
  const {id} = req.params
 const modifiedTodo = await todomodel.findByIdAndUpdate(
  id,
  req.body
 )
 console.log(modifiedTodo);
  if (modifiedTodo) {
    res.redirect("/todo")
  }

 } catch (error) {
  console.log(error);
  
 }
  
})

app.post("/user/signup", async(req, res)=>{
  try {
    console.log(req.body);
    const createduser = await usermodel.create(req.body)
    console.log(createduser);
    if (createduser) {
      res.redirect("/login")
    }

  } catch (error) {
    console.log(error.message);
      if (error.message.includes("user_collection validation failed")) {
        errormessage = "All fields are mandatory"
       return  res.redirect("/signup")
      }

      if (error.message.includes("E11000 duplicate key error collection")) {
        errormessage = "User Already exist"
        return  res.redirect("/signup")
      }

      return res.redirect("/signup")
    
  }
})

app.post("/user/login", async(req,res)=>{
 try {
  console.log(req.body);
  const {email , password} = req.body
  if (!email || !password) {

    return res.redirect("/login")
  }
   const existuser = await usermodel.findOne({email})
   if (existuser && existuser.password == password) {
    console.log("login succesful");
    return res.redirect("/todo")
   }
   console.log("invalid email or password");
   return res.redirect("/login")
   
 } catch (error) {
  console.log(error);
  return res.redirect("/login")
 }
})



connect()
const port = 8005

app.listen(port,()=>{
   console.log("app started at port");
   
}) 