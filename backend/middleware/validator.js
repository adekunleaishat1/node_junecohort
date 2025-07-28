

const Validateschema = (schema) => async(req, res, next) =>{
  try {
     const body = req.body
    const validated =  await schema.validate(body)
    if (validated) {
        next()
    }
  } catch (error) {
    res.status(500).send({message:error.message, status:false})
  }
}


module.exports = {Validateschema}