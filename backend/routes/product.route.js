const express = require("express")
const productroute = express.Router()
const {AddProduct} = require("../controller/product.controller")


productroute.post("/add", AddProduct)


module.exports = productroute