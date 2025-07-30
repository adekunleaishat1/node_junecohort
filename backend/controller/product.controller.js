const productmodel = require("../model/product.model")
const cloudinary = require("../utils/cloudinary")

const AddProduct = async (req, res) =>{
    try {
        const {name, price, description, stock, image} = req.body

     const allimage = await Promise.all(image.map( async(image)=>{
       const convertedimage =  await cloudinary.uploader.upload(image)
       return convertedimage.secure_url
      })) 
        console.log(allimage);
      const upload =  await productmodel.create({
            name,
            price,
            description,
            stock,
            images:allimage
        })
        if (upload) {
            return res.status(200).send({message:"product  uploaded successfully", status:true})
        }
    } catch (error) {
        console.log(error);
            return res.status(500).send({message:error.message , status:false})
        
    }
}


module.exports = {AddProduct}