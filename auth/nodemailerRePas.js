const nodemailer = require("nodemailer");
require("dotenv").config();
const User = require("../models/userModel");

async function sendEmail(resetpaswrdEmail,link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email_,
      pass: process.env.password_,
    },
  });

  transporter.verify((err, success) => {
    if (err) {
      console.log("something error in resetpassword in nodemailer", err);
    } else {
      console.log("mail is ok please infrom the user");
    }
  });

  let mailOptions = {
    from: process.env.email_,
    to:resetpaswrdEmail,
    subject:" Trend-Vista Singup page :your link",
    text:`This is link ${link}`
  };

  // let info = await transporter.sendEmail(mailOptions);
  let info = await transporter.sendMail(mailOptions);

  console.log(`Email to send ${resetpaswrdEmail}:${info.messageId}`);
}
module.exports={sendEmail}