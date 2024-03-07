const User = require("../models/userModel");
const Cart = require("../models/cartModel");
//---------------After login
const verifyUser = async(req, res, next) => {
  if (req.session.userlogged) {
    res.locals.user = req.session.user;
     const cartdetail = await Cart.findOne({ userId: req.session.user_Id });
    if (cartdetail != null) {
      var carCount = 0;
      cartdetail.products.forEach(data=>{
        carCount++
      });
      res.locals.CartCount=carCount
      console.log(carCount);
    }else{
         res.locals.CartCount=0
         console.log();
    }

    next();
  } else {
    res.redirect("/");
  }
};
//---------------Navbar-----------------
const verifyUsernav = async (req, res, next) => {
  if (req.session.userlogged) {
    res.locals.user = req.session.user;

   
    next();
  } else {
    res.redirect("/login");
  }
};
//
//before login
const userExist = (req, res, next) => {
  if (req.session.userlogged) {
    res.redirect("/userhome");

  } else {
    next();
  }
};

//admin side

const adminExist = (req, res, next) => {
  if (req.session.adminlogged) {
    res.render("/admin/dashboard");
  } else {
    next();
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.session.adminlogged) {
    next();
  } else {
    res.redirect("/adlogin");
  }
};

module.exports = {
  verifyUser,
  verifyUsernav,
  userExist,
  adminExist,
  verifyAdmin,
};
