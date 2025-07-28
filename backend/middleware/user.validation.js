const yup = require("yup")


const uservalidation = yup.object({
    username:yup.string().trim().matches(/^[0-9A-Za-z]{6,16}$/, "username must includes the following uppercase letter, lowercase letter, digit, underscore, or hyphen").min(6, "password must be 6 chracters long").required("username is required"),
    email:yup.string().email("input a valid email").required("email is required"),
    password:yup.string().trim().required("password is required")
})



module.exports = {uservalidation}