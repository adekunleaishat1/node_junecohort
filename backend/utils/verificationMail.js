const mailer = require("nodemailer")
const env = require("dotenv").config()

const SendVerificationMail = async (email, username, link) =>{
    
    const messageTemplate = ` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      padding: 40px 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo img {
      width: 100px;
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #333333;
      text-align: center;
    }
    .message {
      font-size: 16px;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 30px;
      text-align: center;
    }
    .button {
      display: block;
      width: fit-content;
      margin: 0 auto 40px auto;
      padding: 12px 30px;
      background-color:hsl(0, 72%, 70%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      font-size: 12px;
      color: #999999;
      text-align: center;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <!-- Replace with your company logo -->
     <-- <img src="" alt="Company Logo" /> -->
    </div>
    <div class="title">Verify Your Email Address</div>
    <div class="message">
      Hello ${username},<br /><br />
      Thank you for signing up with <strong>Taskify</strong>! To complete your registration, please verify your email address by clicking the button below:
    </div>
    <a href="${link}" class="button">Verify Email</a> 
    <div class="message">
      If you did not sign up for this account, please ignore this message.
    </div>
    <div class="footer">
      &copy; 2022 Your Company Name. All rights reserved.<br />
      123 Dugbe Road, Ibadan, Nigeria.
    </div>
  </div>
</body>
</html>`
    const transporter =  mailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.USER_EMAIL,
            pass:process.env.USER_PASS
        }
    })

    const mailOptions = {
        from:process.env.USER_EMAIL,
        to: email,
        subject:`Verification Mail For ${username}`,
        html:messageTemplate
    }

    try {
      const sentmail =  await transporter.sendMail(mailOptions)
      console.log(sentmail);
      if (sentmail) {
        return "mail sent"
      }
    } catch (error) {
        console.log(error);
        
    }
}


module.exports = SendVerificationMail