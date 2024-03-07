const Wishlist = require("../models/wishlistModel");
const Cart = require("../models/cartModel");
const wishlist = require("../models/wishlistModel");
const User = require("../models/userModel");
const { userExist } = require("../middlewares/session");

module.exports = {
  Getwishlist: async (req, res) => {
    try {
      const userId = req.session.user_Id;
      const [Wishlistdata, cartdata] = await Promise.all([
        Wishlist.findOne({ userId: userId }).populate("products.productId"),
        Cart.findOne({ userId: userId }).populate("products.productId"),
      ]);
      console.log("wishlist data", Wishlistdata, "this is user wishlist");
      // const Wishproduct = Wishlistdata.products;
      // const Wishlength = Wishlistdata.products.length;

      if (Wishlistdata != null) {
        let checkproduct = []; // crtprduc=wishlist prdt this used to controlle the buttons
 const Wishproduct = Wishlistdata.products;
 const Wishlength = Wishlistdata.products.length;
        if (cartdata && cartdata.products) {
          //  console.log(Wishlistdata);
          checkproduct = Wishlistdata.products.map((wishlistProduct) => {
            // Check if the wishlist product is in the cart
            wishlistProduct.inCart = cartdata.products.some(
              (cartProduct) =>
                cartProduct.productId &&
                wishlistProduct.productId &&
                cartProduct.productId._id.equals(wishlistProduct.productId._id)
            );

            return wishlistProduct.inCart;
          });
        } else {
          checkproduct = Array(Wishlistdata.products.length).fill(false);
          console.log("not work ");
        }
        // console.log("jijijijiji",checkproduct,'kokokokokoko');
        res.render("user/wishlist", {
          Wishlistdata,
          cartdata,
          Wishproduct,
          checkproduct,
          Wishlength,
        });
      } else {
        res.render("user/wishlist", {
          Wishlistdata,
          cartdata,
          Wishproduct:null,
        
          Wishlength:0,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  //----------Add to wishlist ---------------------------------------------------------------------------------------------------
  addTowishlist: async (req, res) => {
    const productid = req.params.productid;

    const user = await User.findOne({ name: req.session.user });

    if (user) {
      const userWishlist = await Wishlist.findOne({ userId: user._id });

      if (userWishlist == null) {
        console.log("userWishlist exists");

        const Wishdata = {
          userId: user._id,

          products: [
            {
              productId: productid,
            },
          ],
        };
        console.log(Wishdata, "wihshdata");
        await Wishlist.create(Wishdata);
        res.json({ productExist: false, userExist: true });
      } else {
        const Wishlistproduct = await Wishlist.findOne({
          userId: user._id,
          "products.productId": productid,
        });
        console.log(Wishlistproduct);

        if (Wishlistproduct) {
          res.json({ productExist: true, userExist: true });
        } else {
          console.log("Push the product id in wishlist");

          await Wishlist.updateOne(
            { userId: user._id },
            { $push: { products: { productId: productid } } }
          );
          res.json({ productExist: false, userExist: true });
        }
      }
    }
  },

  WishlistDeleteprdt: async (req, res) => {
    try {
      const productid = req.params.productid;

      await Wishlist.updateOne(
        { userId: req.session.user_Id },
        { $pull: { products: { productId: productid } } }
      );
      res.json({ msg: "Removed from your Wishlist" });
    } catch (err) {
      console.log("jijiji", err);
    }
  },
  resendOtp: async (req, res) => {
    try {
      const email = req.session.email;
      console.log(email);
      sendEmail(email);
      res.render("user/otp", { status: "rersend the otp" });
    } catch (err) {
      console.log(err);
    }
  },
};
