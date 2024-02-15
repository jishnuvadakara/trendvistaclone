const express = require("express");
const router = express.Router();
const Userhelper = require("../controller/controller");
const Usercontroller = require("../controller/usercontroller");
const middleman = require("../middlewares/session");
const productcntroller = require("../controller/productcontroller");
const controller = require("../controller/controller");
const usercontroller = require("../controller/usercontroller");
const AddressController = require("../controller/addressController");
const addressController = require("../controller/addressController");
const CartController = require("../controller/cartController");
const cartController = require("../controller/cartController");
const wishlistcController = require("../controller/wishlistcontroller");
const orderController = require("../controller/orderController");
const address = require("../models/addressModel");
// const usercontroller = require('../controller/usercontroller');

//login

router.get("/login", middleman.userExist, Userhelper.getLogin);
router.post("/login", Userhelper.postLogin);

//signup
router.get("/signup2", middleman.userExist, Userhelper.getSignupOtp);
router.post("/signup2", Userhelper.postSignupOtp);

//resendotp
router.get("/resenOtp", middleman.userExist, controller.resenOtp);

//signUp user
router.get("/getSignup", Userhelper.getSignup);
router.post("/signUp", Userhelper.postSignup);

//-----------NOusergot Empty cart
router.get(
  "/EmptyUsercart",
  middleman.userExist,
  Usercontroller.Emptycartnouser
);

//get page--------------------------------------------------------
router.get("/", middleman.userExist, Usercontroller.getGustpage);
router.get("/userhome", middleman.verifyUser, Usercontroller.getUserpage);
//------User home

//-----list the product page------
router.get("/allprodcuts", middleman.verifyUser, Usercontroller.Productslist);

//search the products-----------------------
router.get(
  "/Searchproducts",
  middleman.verifyUser,
  usercontroller.Searchproducts
);


//----Filter in prducts-------------

router.get("/Filter",middleman.verifyUser, usercontroller.Productslist);






//-------single products-----

router.get(
  "/singleproducts/:id",
  middleman.verifyUser,
  Usercontroller.ProductDetail
);
//---Change password-----
router.post(
  "/profileresetpassword",
  middleman.verifyUser,
  usercontroller.Changepassword
);

router.get("/verifyemail", usercontroller.ForgotPassword);
router.post("/verification", usercontroller.EditPassword);

//------------------------------------------------After Sending resetpassword mail----
router.get("/reset-password/:id/:token", usercontroller.resetPassword);
router.post("/Postresetpswrd", usercontroller.postResetpassword);

//-----------------------------------------------------------------------------------------------------------------USERPROFILE-----------------------------------------------------
router.get("/userprofile", middleman.verifyUser, usercontroller.Userprofile);

//---Add----
router.post(
  "/postaddaddress",
  middleman.verifyUser,
  AddressController.postAddress
);
//---Edit---
router.post(
  "/posteditaddress",
  middleman.verifyUser,
  addressController.EditAddress
);
//---Delete-
router.delete(
  "/deleteAddress/:id",
  middleman.verifyUser,
  addressController.DeleteAdress
);
//--Change name----
router.post(
  "/resetusername",
  middleman.verifyUser,
  addressController.Renameuser
);

//post method in check out page using save address
router.post(
  "/Postaddaddress-Checkout",
  middleman.verifyUser,
  addressController.postAddrsCheckout
);

//----------------------------------------------------------------------------------------------------------------CART-------------------------------------
router.get("/Cartuser", middleman.verifyUser, CartController.GetCart);
router.get(
  "/addTocart/:productid",
  middleman.verifyUser,
  CartController.addTocart
);
//change the quantity
router.get(
  "/Updatequantity/:count/:prodId/:qnt/:crtId",
  middleman.verifyUser,
  CartController.Updatequantity
);
//delete
router.delete(
  "/removecrtprdct/:crtprdctId",
  middleman.verifyUser,
  CartController.Removecartproduct
);

//--------------------------------------------------------------------------------------------------------------------Wishlist -----------------------------------------------------
router.get(
  "/userwishlist",
  middleman.verifyUser,
  wishlistcController.Getwishlist
);
router.get(
  "/addTowishlist/:productid",
  middleman.verifyUser,
  wishlistcController.addTowishlist
);
router.delete(
  "/removeFromWishlist/:productid",
  middleman.verifyUser,
  wishlistcController.WishlistDeleteprdt
);

//---------------------------------------------------------------------------------------------------------------------Checkoutpage-------------------------------------------------
router.get(
  "/checkoutpage",
  middleman.verifyUser,
  orderController.GetCheckoutpage
);
router.get(
  "/confirmadressmsg/:addressId",
  middleman.verifyUser,
  orderController.getAddressMsg
);
router.get(
  "/confirmorderMethod/:type",
  middleman.verifyUser,
  orderController.Confirmoders
);

//gkot success page
router.get(
  "/PayementSuccesspage",
  middleman.verifyUser,
  orderController.GotsSuccesspage
);

router.get("/Myorderpage", middleman.verifyUser, orderController.GetMyorder);

router.get(
  "/Myorderdetail/:id",
  middleman.verifyUser,
  orderController.GetMyOrderdetail
);
router.delete(
  "/CancelSingleorder/:OrderId/:index",
  middleman.verifyUser,
  orderController.cancelSingleOrder
);

router.post("/RetrunOrder",middleman.verifyUser,orderController.ReturnOrder);

//Razorpay verify router
router.post("/VerifyRazorpay", orderController.VerifyPayment);

//-----------------------User logout-----------------
router.get("/logout", controller.Userlogout);

module.exports = router;
