const nodemailer = require("nodemailer");
require("dotenv").config();
const User = require("../models/userModel");

async function SendRefMail(representmail, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email_,
      pass: process.env.password_,
    },
  });

  transporter.verify((err, success) => {
    if (err) {
      console.log("Something problem in reference in mail", err);
    } else {
      console.log("Reference mail is working no problem");
    }
  });

  let mailOptions = {
    from: process.env.email,
    to: representmail,
    subject: "Trend-Vista e-commerce pvt ltd ",
    text: `This is your Reference link ${link}`,
  };

  let info = await transporter.SendRefMail(mailOptions); // Changed from SendMail to sendMail
  console.log(`Reference share to ${representmail}:${info.messageId}`);
}

module.exports = { SendRefMail };
