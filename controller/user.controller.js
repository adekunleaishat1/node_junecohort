
let errormessage ;

const getLandingpage = (req, res) =>{
    res.render("index",{name:"Shola"})
}


const getSignup = (req, res) =>{
    res.render("signup",{errormessage})
}


module.exports = {getLandingpage, getSignup}