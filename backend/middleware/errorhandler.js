const errorhandler = (error, req, res, next)=> {
    if (error.name == "MongoServerError") {
        if ( error.message.includes("E11000 duplicate key error")) {
            return res.status(400).send({message:"User already exist", staus:"false"})
        }
        if (error.message.includes("password: Cast to Number failed")) {
          return res.status(500).send({message:"Password must be a number", status:false})     
        }
    }else if(error.name == "Authentication error"){
        return res.status(401).send({message: error.message || "Authentication error", staus:"false"})
    } else if (error.name === "TokenExpiredError") {
        return res.status(401).send({message: "Token has expired", status: "false"});
    }
    else if(error.name == "Authorization error"){
        return res.status(403).send({message: error.message ||"Authorization error", staus:"false"})
    }else {
        return res.status(500).send({message:"internal server error", staus:"false"})
    }
}

module.exports = {errorhandler}