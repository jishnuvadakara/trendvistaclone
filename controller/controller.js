const User = require("../models/userModel");
const otp = require("../models/otpModel");
const { sendEmail } = require("../auth/nodemailer");
const { getSignupOtp } = require("../util/generateotp");
const products = require("../models/productModel");
const wallet = require("../models/walletModal");
const walletHistory = require("../models/walletHistory");
// const {hashData,verifyHasheData}=require('../util/bcrypt')
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
// const { default: refunds } = require("razorpay/dist/types/refunds");

// let _email;
// let _password;
module.exports = {
  //getsignup
  getSignupOtp: async (req, res) => {
    try {
      console.log("get ,method is working");
      const referId = req.query.refer;
      console.log(req.query.refer, "this is query");
      let user;
      if (mongoose.Types.ObjectId.isValid(referId)) {
        user = await User.findOne({ _id: referId });
      }
      console.log(user, "this is refer id match user");
      console.log(referId);
      if (referId != undefined) {
        res.render("user/signup", { refer: referId });
      } else {
        res.render("user/signup", { refer: null });
      }
    } catch (err) {
      console.log(err);
    }
  },
  //post
  postSignupOtp: async (req, res) => {
    try {
      const { name, email, password, status } = req.body;
      console.log("user data form requrest body", req.body);
      if (!req.body.referredBy) {
        req.body.referredBy = null;
      }
      const data = await User.findOne({ email: email });
      const saltRounds = 10;
      req.session.UerOtpemail = email;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(hashedPassword);
      req.session.hashedPass = hashedPassword;

      if (data) {
        res.render("user/signup", { exists: "User already exists" });
      } else {
        const sendedOTP = sendEmail(req.session.UerOtpemail);
        const hashedpass = req.session.hashedPass;
        console.log(
          sendedOTP,
          "------------------------------------------------------------------------->"
        );
        req.session.UserData = {
          name: name,
          email: email,
          password: hashedpass,
          referredBy: req.body.referredBy,
        };

        res.render("user/otp"); //it means got  the otp page that i use this way
        // console.log(req.session.UserData.email);
      }
    } catch (err) {
      console.log("error hashing password", err);
    }
  },

  // go to the otp page using methods getSignup,postSignup
  getSignup: async (req, res) => {
    try {
      res.render("user/otp");
    } catch (err) {
      console.log(err);
    }
  },
  //postSignup
  postSignup: async (req, res) => {
    try {
      const arr = [];
      const { num1, num2, num3, num4 } = req.body;
      arr.push(num1);
      arr.push(num2);
      arr.push(num3);
      arr.push(num4);

      // Join the array to form the OTP
      const userotp = arr.join("").toString();
      const otp_ = await otp.findOne({ email: req.session.UserData.email });
      const email = req.session.UserData.email;

      let referral;
      const reff = req.session.UserData.referredBy;
      console.log(reff, "this user referredBy", req.session.UserData);

      // Check the referred condition
      if (reff === undefined) {
        req.session.UserData.referredBy = null;
        referral = req.session.UserData.referredBy;
      } else {
        referral = req.session.UserData.referredBy;
      }
      console.log(referral, "this is user refferal ");

      console.log(otp_ ?? "null data");
      if (otp_?.otp == userotp && otp_ != null) {
        console.log("data check");
        User.create(req.session.UserData).then(async (data) => {
          const refferuser = await User.findOne({
            email: req.session.UserData.email,
          });
          await wallet.create({ userId: refferuser._id, wallet: 0 });
          console.log("this is user data again come ", refferuser);

          //checking the refferal
          if (referral != "" && referral != null) {
            const refwallet = await wallet.findOne({ userId: referral });

            // again if increment and push the wallet datas
            if (refwallet) {
              await Promise.all([
                wallet.updateOne(
                  { userId: referral },
                  { $inc: { wallet: 100 } }
                ),
                wallet.updateOne(
                  { userId: referral },
                  { $push: { invaited: refferuser._id } }
                ),
                wallet.updateOne(
                  { userId: refferuser._id },
                  { $inc: { wallet: 50 } }
                ),
              ]);
            } else {
              await wallet.create({
                userId: referral,
                wallet: 100,
                invaited: [refferuser._id],
              });
            }
            //the check the walllet history\
            const walletHis = await walletHistory.findOne({ userId: referral });

            if (walletHis) {
              let amount = 100;
              let reason = "Bonus for referring an user";
              let type = "credit";
              let date = new Date();

              
              await walletHistory.updateOne(
                { userId: referral },
                {
                  $push: {
                    refund: { amount: amount, reason: reason,type:type, date: date },
                  },
                },
                { new: true }
              );
            } else {
              let amount = 100;
              let reason = "Bonus for referring an user";
              let date = new Date();
              let type = "credit";
              await walletHistory.create({
                userId: referral,
                refund: [
                  { amount: amount, reason: reason, type: type, date: date },
                ],
              });
            }
            let signup = "SignUp using referral link bonus";
            await walletHistory.create({
              userId: refferuser._id,
              refund: [
                {
                  amount: 50,
                  reason: signup,
                  type: "credit",
                  date: new Date(),
                },
              ],
            });
          }
          res.render("user/login", { msg: "Signup successful" });
        });

        // Render success message for signup

        console.log(userotp);
      } else {
        res.render("user/otp", { err: "Invalid OTP. Please check" });
      }
    } catch (error) {
      console.log("An issue occurred:", error);
      // Handle error gracefully
    }
  },

  //login
  getLogin: async (req, res) => {
    res.render("./user/login");
  },

  //Signup page fully complited and after come again login page
  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const connect = await User.findOne({ email: email });
      if (connect) {
        const isMatch = await bcrypt.compare(password, connect.password);

        console.log("ismatch", isMatch);
        // let msg = "";
        // if (connect.status == "block") {
        //   msg = "Sorry This Account Has Blocked Admin";
        // }

        if (isMatch && connect.status == "active") {
          console.log(
            "............................................................."
          );
          req.session.user = connect.name;
          req.session.userlogged = true;
          req.session.email = connect.email;
          req.session.user_Id = connect._id;
          const currentDate = new Date();
          req.session.usertime = currentDate.toLocaleDateString();
          console.log(req.session.usertime);
          //  console.log( "gry6yyuyuy",req.session.email);
          //  console.log(connect.email);

          // console.log(product,'--------------------------------->');
          res.redirect("/userhome");
          // res.render('user/userhome',{})
        } else {
          res.render("user/login", { err: "Incorrect password or email" });
        }
      } else {
        res.render("user/login", { err: "Invald password or email " });
      }
    } catch (err) {
      console.log("post login not support", err);
    }
  },
  resenOtp: async (req, res) => {
    try {
      console.log("uer press try to resend otp");
      console.log(req.session.UerOtpemail, "this mail user asking resend otp");

      sendEmail(req.session.UerOtpemail);
      res.render("user/otp", {
        status: ` Verification code sent to${req.session.UerOtpemail}`,
      });
    } catch (err) {
      console.log(err);
    }
  },

  Userlogout: async (req, res) => {
    try {
      req.session.discountAmount = undefined;
      req.session.userlogged = false;
      res.redirect("/");
    } catch (err) {
      console.log("Userlogout", err);
    }
  },

  //5sec
};
