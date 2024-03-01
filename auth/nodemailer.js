const nodemailer = require("nodemailer");
require("dotenv").config();
const { generateOTP } = require("../util/generateotp");
const User = require("../models/userModel");
const otp = require("../models/otpModel");
const { info } = require("pdfkit");

async function sendEmail(recipientEmail) {
  //otp generation in here
  // await otp.deleteOne({email: recipintEmail});
  await otp.deleteOne({ email: recipientEmail });

  const OTP = generateOTP();
  console.log(`Your otp is here ${OTP}`);

  //after millisecond delete the data
  await otp.create({ email: recipientEmail, otp: OTP });
  // ...

  setTimeout(async () => {
    await otp.deleteOne({ email: recipientEmail }); // Fix: Correct the field name to 'email'
  }, 120000);

  // ...

  //create nodemailer  transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email_,
      pass: process.env.password_,
    },
  });

  transporter.verify((err, success) => {
    if (err) {
      console.log(err);
    } else {
      console.log("mail is ok");
    }
  });
  let mailOptions = {
    from: process.env.email_,
    to: recipientEmail,
    subject: "Trend-Vista e-commerce pvt ltd ",
    text: `Your otp is ${OTP}`, //Fix:
  };

  let info = await transporter.sendMail(mailOptions);
  console.log(`Email send to ${recipientEmail} :${info.messageId}`);
}

module.exports = { sendEmail };
