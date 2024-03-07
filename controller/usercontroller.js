const User = require("../models/userModel");
const products = require("../models/productModel");
const catagory = require("../models/catagoryModel");
const Brand = require("../models/brandModel");
const Address = require("../models/addressModel");
const Cart = require("../models/cartModel");
const wallet = require("../models/walletModal");
const walletHistory = require("../models/walletHistory");
const Banner = require("../models/bannerModel");
const feedback = require("../models/feedbackModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../auth/nodemailerRePas");
const { SendRefMail } = require("../auth/nodemailerReffernce");

const JWT_SECRET = "user.supper.key";

module.exports = {
  getGustpage: async (req, res) => {
    try {
      const [BannerData, catagories, data] = await Promise.all([
        Banner.find(),
        catagory.find({}),
        products.find({ status: "active" }).populate("catagory"),
      ]);
      console.log(catagories, "huhuhuh");
      console.log(data, "this product");
      console.log(BannerData, "this was the banner data");

      // data.forEach((datas) => {
      //   console.log("this foreach");
      //   if (datas.catagory.catagoryname == "FLAGSHIP MOBILES") {
      //     console.log(datas.catagory);
      //   }
      //   console.log("oek");
      // });

      res.render("user/gusthome", { data, BannerData });
    } catch (err) {
      console.log(err);
    }
  },
  getUserpage: async (req, res) => {
    try {
      const [product, allproduct, user] = await Promise.all([
        products.find({ status: "active" }).populate("catagory"),
        products.find({ status: "active" }),
        User.findOne({ email: req.session.email }),
      ]);
      //  console.log(req.session.user_Id,"ajith id");
      console.log(req.session.usertime);
      console.log("username:", req.session.user);
      console.log(req.session.email);
      const userId = user._id;
      console.log(
        "🚀 ~ file: usercontroller.js:54 ~ getUserpage: ~ userId:",
        userId
      );

      res.render("user/userhome", {
        product,
        user: req.session.user,
        userId: userId,
        allproduct,
      });
    } catch (err) {
      console.log(err);
    }
  },

  //-----------------------------------------------------------------
  Productslist: async (req, res) => {
    try {
      console.log(req.query);
      const {
        catagoryees,
        Brandnamees,
        minPrice,
        maxPrice,
        page = 1,
        perPage = 6,
      } = req.query;

      // console.log(req.query.page);

      // const page = parseInt(req.query.page) || 1;
      const limit = 6;
      // const perPage = limit;

      const skip = (page - 1) * limit;

      //starting the fiilter for working
      let allprodts = 0;
      if (
        catagoryees == undefined &&
        Brandnamees == undefined &&
        maxPrice < 55000
      ) {
        allprodts = await products
          .find({ Price: { $gte: minPrice, $lte: maxPrice }, status: "active" })
          .populate("catagory")
          .skip(skip)
          .limit(limit);
      } else if (catagoryees == undefined && Brandnamees == undefined) {
        allprodts = await products
          .find({ status: "active" })
          .populate("catagory")
          .skip(skip)
          .limit(limit);
      } else if (catagoryees && Brandnamees) {
        allprodts = await products
          .find({
            catagory: catagoryees,
            BrandName: Brandnamees,
            status: "active",
          })
          .populate("catagory")
          .skip(skip)
          .limit(limit);
      } else if (catagoryees == undefined && Brandnamees) {
        allprodts = await products
          .find({ BrandName: Brandnamees, status: "active" })
          .populate("catagory")
          .skip(skip)
          .limit(limit);
      } else if (Brandnamees == undefined && catagoryees) {
        allprodts = await products
          .find({ catagory: catagoryees, status: "active" })
          .populate("catagory")
          .skip(skip)
          .limit(limit);
      } else {
        allprodts = await products
          .find({
            catagory: catagoryees,
            BrandName: Brandnamees,
            status: "active",
            Price: { $gte: minPrice, $lte: maxPrice },
          })
          .populate("catagory")
          .skip(skip)
          .limit(limit);
      }

      const [countprodts, brandcount, catagories] = await Promise.all([
        products.find().count(),
        Brand.aggregate([
          { $group: { _id: "$Brandname", count: { $sum: 1 } } },
        ]),
        catagory.find({ status: "active" }),
      ]);

      const totalPages = Math.ceil(countprodts / limit);
      console.log("allproduct", allprodts, "t");

      res.render("user/allproducts", {
        allprodts,
        countprodts,
        brandcount,
        catagories,
        totalPages,
        currentPage: page,
        perPage: perPage,
      });
    } catch (err) {
      console.log("come Up user side productcontroller-1", err);
    }
  },

  //------------------Single Productss------------------
  ProductDetail: async (req, res) => {
    try {
      const prdid = req.params.id;
      console.log(prdid, "productiid");
      console.log("this is userid", req.session.user_Id);
      const [prdt, Cartdetail] = await Promise.all([
        products.find({ _id: prdid }),
        Cart.findOne({
          userId: req.session.user_Id,
          "products.productId": prdid,
        }),
      ]);
      // console.log("user",Cart);
      res.render("user/singleproduct", { product: prdt[0], Cartdetail });
    } catch (err) {
      console.log("come up user side productcontroller-2", err);
    }
  },
  Emptycartnouser: async (req, res) => {
    try {
      const cart = null;

      res.render("user/Emptycart");
    } catch (err) {
      console.log(err);
    }
  },

  //--------------------------------------Userprofile------------------------------------------

  Userprofile: async (req, res) => {
    try {
      const userData = await User.findOne({ email: req.session.email });
      const ErrorMsg = req.session.errorMsg;

      const userID = userData._id;
      console.log(userID);
      const userAdd = await Address.find({ userId: userID });
      res.render("user/userprofile", { userData, userAdd, ErrorMsg });
    } catch (err) {
      console.log(err);
    }
  },

  //--------------------------------------------------------------------------------------User change password-----------------------------------------------
  Changepassword: async (req, res) => {
    try {
      console.log(req.body);
      const { currentpassword, password } = req.body;
      console.log(currentpassword);
      console.log(password);
      const UserData = await User.findOne({ _id: req.session.user_Id });
      const Ismatch = await bcrypt.compare(currentpassword, UserData.password);
      console.log(Ismatch, "kokoko");
      const saltRounds = 10;
      if (Ismatch) {
        const hashedchangepass = await bcrypt.hash(password, saltRounds);
        await User.updateOne(
          { _id: req.session.user_Id },
          { $set: { password: hashedchangepass } }
        );
        console.log("Userchange the password in uerprofile page");
        res.redirect("/userprofile");
      } else {
        req.session.errorMsg = "Your password is incorrect";
        res.redirect("/userprofile");
      }
    } catch (err) {
      console.log("Something problem in change password ", err);
    }
  },
  //----------------------------------------------------------------------------Forgot password--------------------------

  ForgotPassword: async (req, res) => {
    try {
      // console.log(req.body);
      res.render("user/verificationMail");
    } catch (err) {
      console.log("Somethig problem in Forgot password ");
    }
  },
  EditPassword: async (req, res) => {
    try {
      console.log(req.body);
      const { email } = req.body;

      let msg = 0;

      console.log(email);
      const IsmatchMail = await User.findOne({ email: email });

      if (IsmatchMail) {
        //using jwt token
        const secret = JWT_SECRET + IsmatchMail.password;

        const payload = {
          email: IsmatchMail.email,
          id: IsmatchMail._id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "5m" });

        const link = `http://localhost:8000/reset-password/${IsmatchMail._id}/${token}`;

        sendEmail(IsmatchMail.email, link);

        msg = "Please check your email for the link.";
        res.render("user/verificationMail", { msg });

        console.log(link);

        console.log(secret);
      } else {
        msg = "You are not valid; please log in.";
        res.render("user/verificationMail", { msg });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // after sending  mail user got this page
  resetPassword: async (req, res) => {
    try {
      console.log(req.params);
      const { id, token } = req.params;

      const Userdata = await User.findOne({ _id: id });
      console.log(Userdata);
      if (Userdata == null) {
        console.log("user not available");
        const msg = "Invalid User";
        res.render("user/verificationMail", { msg });
      } else {
        const secret = JWT_SECRET + Userdata.password;
        req.session.resendEmail = Userdata.email;
        try {
          const payload = jwt.verify(token, secret);
          res.render("user/resetPassword");
        } catch (err) {
          console.log("error", err);
          const msg = "Time limit exceeded";
          res.render("user/verificationMail", { msg });
        }
      }
    } catch (err) {
      console.log(err, "Error");
    }
  },
  postResetpassword: async (req, res) => {
    try {
      console.log(req.body);
      const { password } = req.body;
      const saltRounds = 10;

      const hashednewpass = await bcrypt.hash(password, saltRounds);
      console.log(hashednewpass);
      console.log(req.session.resendEmail);

      await User.updateOne(
        { email: req.session.resendEmail },
        { $set: { password: hashednewpass } }
      );
      res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  },

  //Search product in user navbar
  Searchproducts: async (req, res) => {
    try {
      const searchQuery = req.query.search || ""; // Assuming your search input is named 'query'

      const [CatagoryReg, BrandReg] = await Promise.all([
        catagory.findOne({
          catagoryname: { $regex: "^" + searchQuery, $options: "i" },
        }),
        Brand.findOne({
          Brandname: { $regex: "^" + searchQuery, $options: "i" },
        }),
      ]);

      // After that search product collection
      const SearchOption = {
        $or: [
          { productName: { $regex: "^" + searchQuery, $options: "i" } },
          { catagory: CatagoryReg },
          { BrandName: BrandReg },
        ],
      };
      const SearchResutl = await products
        .find(SearchOption)
        .populate("catagory");
      console.log(SearchResutl, "this is after result");

      res.render("user/Searchproducts", { SearchResutl });
      console.log(SearchResutl, "this final Search result");
    } catch (err) {
      console.log(err, "Something problem in handile search in user navbar ");
    }
  },
  filterexample: async (req, res) => {
    try {
      console.log(req.query);
      const { catagory, Brandname, minPrice, maxProce } = req.query;
      console.log(catagory, Brandname, "Catagory and Brand");
    } catch (err) {
      console.log(err);
    }
  },

  //Reference  fucntion
  Refference: async (req, res) => {
    try {
      console.log(req.body, "refference mail and user ID");
      const { email, userId } = req.body;

      const userdetail = await User.findOne({ _id: userId });
      console.log("this is user id", userdetail);
      if (userdetail) {
        const link = `http://localhost:8000/signup2/?refer=${userdetail._id}`;
        console.log("refference link for include user mail", link);
        //  SendRefMail(email, link);
        res.json({ msg: "Share the link for your friend email" });
      } else {
        res.json({ msg: "No user" });
      }
    } catch (err) {
      console.log(err);
    }
  },
  //user Wallet and wallet History-----------------------------------------------------------------------
  GetWallet: async (req, res) => {
    try {
      const [WalletUser, WalletUserHist] = await Promise.all([
        wallet.findOne({ userId: req.session.user_Id }),
        walletHistory.findOne({ userId: req.session.user_Id }),
      ]);
      WalletUserHist?.refund?.forEach((element) => {
        console.log(element, "thi sis is sis is sis is si si isisi");
      });
      console.log("userWallet", WalletUser);
      console.log("userHistory for wallet", WalletUserHist);
      res.render("user/MyWallet", { WalletUser, WalletUserHist });
    } catch (err) {
      console.log("This mistake for the User walletcontrolling :", err);
    }
  },
  //this funtionality for user image
  UserImage: async (req, res) => {
    console.log("thsi is the image", req.file);
    try {
      console.log("File uploaded:", req.file.path, "this is oke");
      const userImage = await User.findOne({ email: req.session.email });
      if (userImage) {
        console.log(
          "this is for user data",
          userImage,
          "user have add image folder "
        );
        let files = req?.file;
        let images = files.filename;

        console.log("this is for user image ", files, "////");
        console.log("this is for user image ", images, "////");
        await User.updateOne(
          { email: req.session.email },
          { $set: { Userimage: images } }
        );
      } else {
        console.log("no user no request ");
      }

      res.json({ msg: "Successfully ADD " });
    } catch (err) {
      console.log("UserImage is something problem ", err);
    }
  },
  DeleteUserImag: async (req, res) => {
    try {
      console.log(req.params);
      const usrdetail = await User.findOne({ _id: req.params.id });
      console.log(usrdetail);
      if (usrdetail) {
        await User.updateOne(
          { _id: req.params.id },
          { $set: { Userimage: null } }
        );
        res.json({ msg: "Deleted Successfully" });
      } else {
        res.json({ msg: "no valid user" });
      }
    } catch (err) {
      console.log("something problem in deletimage for usercontroller", err);
    }
  },
  FeedbackResponse: async (req, res) => {
    try {
      console.log("the response:", req.body);
      const { rating, feedbackresponse, UserId } = req.body;
      console.log(feedbackresponse);
      const Usertdetails = await User.findOne({ _id: UserId });
      if (Usertdetails) {
        const userfeedback = await feedback.findOne({ userId: Usertdetails });
        if (userfeedback) {
          let data = {
            userId: UserId,
            Userresponse: feedbackresponse,
            feedbackStar: rating,
          };
          await feedback.updateOne(
            { userId: UserId },
            { $set: { Userresponse: feedbackresponse, feedbackStar: rating } }
          );
          res.json({ msg: "Thanks for the coorperation " });
        } else {
          console.log("user have not response before days");
          let data = {
            userId: UserId,
            Userresponse: feedbackresponse,
            feedbackStar: rating,
          };
          console.log(
            "🚀 ~ file: usercontroller.js:488 ~ FeedbackResponse: ~ data:",
            data
          );

          await feedback.create(data);
          res.json({ msg: "Thank Your for your response" });
        }
      } else {
        console.log("user cannot here");
        res.json({ msg: "No User " });
      }
    } catch (err) {
      console.log("the problem was FeedbackResponse", err);
    }
  },
};
