const User = require("../models/userModel");
const otp = require("../models/otpModel");
const { sendEmail } = require("../auth/nodemailer");
const { getSignupOtp } = require("../util/generateotp");
const products = require("../models/productModel");
// const {hashData,verifyHasheData}=require('../util/bcrypt')
const bcrypt = require("bcrypt");

// let _email;
// let _password;
module.exports = {
  //getsignup
  getSignupOtp: async (req, res) => {
    try {
      console.log("get method is ok");
      res.render("user/signup");
    } catch (err) {
      console.log(err);
    }
  },
  //post
  postSignupOtp: async (req, res) => {
    try {
      const { name, email, password, status } = req.body;
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
      // console.log("hey");
      const arr = [];
      // console.log(req.body);
      const { num1, num2, num3, num4 } = req.body;
      arr.push(num1);
      arr.push(num2);
      arr.push(num3);
      arr.push(num4);

      //the join the array
      const userotp = arr.join("").toString();
      const otp_ = await otp.findOne({ email: req.session.UserData.email });
      const email = req.session.UserData.email;

      console.log(otp_ ?? "null data");
      if (otp_?.otp == userotp && otp_ != null) {
        console.log("data check");

        // const hashedPassword = req.session.hashedPass;

        const userData = await User.create(req.session.UserData);
        // console.log(userData);

        console.log(userData);
        if (userData) {
          res.render("user/login", { msg: "Signup will success" });
        }

        //  User.create(req.session.UserData).then((data)=>{
        // })
        console.log(userotp);
      } else {
        res.render("user/otp", { err: "Invalid otp plese check" });
      }
    } catch (error) {
      console.log("here is the issue man___________________________________");
      console.log(error);
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
        const msg=""
        if (connect.status == "block") {
          msg="Sorry This Account Has Blocked Admin"
        }

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
          res.render("user/login", { err: "Incorrect password or email",msg });
        }
      } else {
        res.render("user/login", { err: "Invald password or email ",msg });
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
      res.render("user/otp", { status: ` Verification code sent to${req.session.UerOtpemail}`});
    } catch (err) {
      console.log(err);
    }
  },

  Userlogout: async (req, res) => {
    try {
      req.session.userlogged = false;
      res.redirect("/");
    } catch (err) {
      console.log("Userlogout", err);
    }
  },

  //5sec
};
