const Order = require("../models/orderModel");
const Address = require("../models/addressModel");
const Products = require("../models/productModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Return = require("../models/returnModel");
const products = require("../models/productModel");
const { disconnect } = require("mongoose");
const { CreateRazorpayOrder } = require("../controller/razorpayController");
const crypto = require("crypto");
require("dotenv").config();

module.exports = {
  GetCheckoutpage: async (req, res) => {
    try {
      const [Orderdetail, Addressdetail, Cartdata] = await Promise.all([
        Order.findOne({ userId: req.session.user_Id }),
        Address.find({ userId: req.session.user_Id }),
        Cart.findOne({ userId: req.session.user_Id }),
      ]);

      const TotalPrice = req.session.Totalamnt;
      const Grandtotal = req.session.Grandamnt;
      const Discount = req.session.Discount;

      //go to the checkout page
      if (Cartdata == null) {
        res.redirect("/userhome");
      } else {
        //  console.log(Addressdetail, "this oder address in user");
        res.render("user/checkoutpage", {
          Addressdetail,
          TotalPrice,
          Grandtotal,
          Discount,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getAddressMsg: async (req, res) => {
    try {
      console.log(req.params);
      const addressId = req.params.addressId;
      console.log(addressId);
      req.session.adressId = addressId;
      res.json({ msg: "This address will receive the order." });
    } catch (err) {
      console.log(err);
    }
  },

  Confirmoders: async (req, res) => {
    try {
      const addressId = req.session.adressId;
      const UserEmail = req.session.email;
      const Grandtotal = req.session.Grandamnt;
      const Discount = req.session.Discount;

      console.log(addressId);
      console.log(req.params);
      const payementmethod = req.params.type;
      console.log(payementmethod);

      console.log(req.session.adressId);
      if (req.session.adressId == undefined) {
        res.json({ msg: "please click the deliver button" });
      } else if (
        payementmethod == "cashOnDelivery" &&
        req.session.adressId != undefined
      ) {
        //findt the current user------
        const UserData = await User.findOne({ email: UserEmail });
        console.log(UserData);

        //store the current user--
        const [AddressDetails, Cartdetail] = await Promise.all([
          Address.findOne({ _id: addressId }),
          Cart.findOne({ userId: UserData._id }),
        ]);
        console.log("UerCart", Cartdetail);
        //Set The Current Date
        const currentDate = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        console.log(currentDate);

        //Set The Delivery Date
        const DeliveryDate = new Date(
          Date.now() + 4 * 24 * 60 * 60 * 1000
        ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        console.log(DeliveryDate);

        // Userorderdetail Save And Create

        let Myorder = {
          userId: UserData._id,
          products: Cartdetail.products,
          address: {
            name: AddressDetails.name,
            address: AddressDetails.address,
            city: AddressDetails.city,
            pincode: AddressDetails.pincode,
            district: AddressDetails.district,
            state: AddressDetails.state,
            locality: AddressDetails.locality,
            addressType: AddressDetails.addressType,
            mobile: AddressDetails.mobile,
          },
          orderDate: currentDate,
          expectedDeliveryDate: DeliveryDate,
          payementMethod: payementmethod,
          payementStatus: "Pending",
          totalAmount: Grandtotal,
          discountAmount: Discount,
          orderStatus: "Order Processing",
        };

        //Then

        //Decrease The Product Quantity
        const Cartprodt = Cartdetail.products;

        for (let data of Cartprodt) {
          try {
            const dataprId = data.productId;
            req.session.ProductId = dataprId;
            const productquant = await products.findOne({ _id: dataprId });

            const oldQuantity = productquant.AvailableQuantity;
            // console.log(oldQuantity, "this  old ");
            const CartQuantity = data.quantity;
            console.log(CartQuantity, "This cartQuantity");

            const newQuantity = oldQuantity - CartQuantity;
            // console.log(newQuantity);

            //After Update The New quantity

            await Products.updateOne(
              { _id: dataprId },
              { $set: { AvailableQuantity: newQuantity } }
            );
          } catch (er) {
            console.log("Mistake in quantity updated time ", err);
          }
        }
        //After That create Order
        await Order.create(Myorder);

        //After delete Cart in products

        await Cart.findByIdAndDelete(Cartdetail._id);

        res.json({ payment: "COD" });

        //checking the paymentmethod is onlinePayment................................................................................
      } else if (
        payementmethod == "onlinePayment" &&
        req.session.adressId != undefined
      ) {
        const Userdatas = await User.findOne({ email: UserEmail });
        console.log("This the original User:", Userdatas);

        const [AddressUser, CartUser] = await Promise.all([
          Address.findOne({ _id: addressId }),
          Cart.findOne({ userId: Userdatas._id }),
        ]);

        //Set The Current Date
        const currentDate = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        console.log(currentDate);

        //Set The Delivery Date
        const DeliveryDate = new Date(
          Date.now() + 4 * 24 * 60 * 60 * 1000
        ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        console.log(DeliveryDate);

        //store all data in specific variable
        let Myorder = {
          userId: Userdatas._id,
          products: CartUser.products,
          address: {
            name: AddressUser.name,
            address: AddressUser.address,
            city: AddressUser.city,
            pincode: AddressUser.pincode,
            district: AddressUser.district,
            state: AddressUser.state,
            locality: AddressUser.locality,
            addressType: AddressUser.addressType,
            mobile: AddressUser.mobile,
          },
          orderDate: currentDate,
          expectedDeliveryDate: DeliveryDate,
          payementMethod: payementmethod,
          payementStatus: "Payment Successful",
          totalAmount: Grandtotal,
          discountAmount: Discount,
          orderStatus: "Order Processing",
        };
        //Create the datas on order colleoction
        await Order.create(Myorder);

        // After That decrease the product quanatity and delete the user cart

        //decrease the product quantity
        const Cartprodt = CartUser.products;
        for (const data of Cartprodt) {
          const dataprId = data.productId;

          const dataproductdetail = await products.findOne({ _id: dataprId });

          console.log(
            dataproductdetail,
            "This is the orderproduts details.........."
          );

          const oldQuantity = dataproductdetail.AvailableQuantity;
          console.log("Old Quantity is this ..........", oldQuantity);

          const CartQuantity = data.quantity;
          console.log("This is the CartQuantity :", CartQuantity);

          const newQuantity = oldQuantity - CartQuantity;

          console.log("this is the newe quantity :", newQuantity);

          //----------------------------------------------------------------After enable this -------------------------

          await products.updateOne(
            { _id: dataprId },
            { $set: { AvailableQuantity: newQuantity } }
          );
          req.session.UsercartId = CartUser._id;

          //after that delete the product in usercart

          // await Cart.findByIdAndDelete(CartUser._id)
        }
        //find the first order

        const orderder = await Order.findOne().sort({ _id: -1 }).limit(1);
        console.log("this is Id:", orderder.id + "");
        console.log(orderder._id, ":this is the first order ");
        CreateRazorpayOrder(res, orderder._id + "", Grandtotal);

        //call the razorpay function and pass the order id
      }
    } catch (err) {
      console.log(err);
    }
  },

  //VerifyRazorpay
  VerifyPayment: async (req, res) => {
    try {
      console.log(
        req.body,
        "......................................................................."
      );

      let hmac = crypto.createHmac("sha256", process.env.RazorpayKey_secret);

      hmac.update(
        req.body.payment.razorpay_order_id +
          "|" +
          req.body.payment.razorpay_payment_id
      );
      console.log(req.body.payment.razorpay_payment_id, "o=o=o=o");

      hmac = hmac.digest("hex");
      if (hmac == req.body.payment.razorpay_signature) {
        console.log("is equal working ...............................");

        const orderId = req.body.order.receipt;

        await Order.updateOne(
          { _id: orderId },
          { $set: { payementStatus: "Paid", payementMethod: "Online" } }
        );
        let Cartid = req.session.UsercartId;

        //After delete Cart products
        await Cart.findByIdAndDelete(Cartid);

        res.json({ success: true });
      } else {
        console.log("Something problem in verifyrazorpay...................");
        res.json({ success: false });
      }
    } catch (err) {
      console.log("Something problem in verifyRazorpay");
    }
  },

  //Got Success page
  GotsSuccesspage: async (req, res) => {
    try {
      res.render("user/payementsuccessfullpage");
    } catch (err) {
      console.log("errr", err);
    }
  },

  GetMyorder: async (req, res) => {
    try {
      const TotalPrice = req.session.Totalamnt;
      const Grandtotal = req.session.Grandamnt;
      const [Myorder, productOrder] = await Promise.all([
        Order.find({ userId: req.session.user_Id })
          .populate("products.productId")
          .sort({ orderDate: -1 }),
      ]);

      console.log(Myorder, "kokokokokokok");
      res.render("user/Myorder", {
        Myorder,
        TotalPrice,
        Grandtotal,
      });
    } catch (err) {
      console.log(err);
    }
  },
  GetMyOrderdetail: async (req, res) => {
    try {
      console.log(req.params);
      const orderId = req.params.id;
      const Orderdetail = await Order.findOne({ _id: orderId }).populate(
        "products.productId"
      );

      res.render("user/Myorderdetails", { Orderdetail });

      // console.log(Orderdetail);
    } catch (err) {
      console.log(err);
    }
  },
  //----------------------------------------------------------------------------------SingleOrdercancel----------------------------------------------------
  cancelSingleOrder: async (req, res) => {
    try {
      console.log(req.params);
      const { OrderId, index } = req.params;
      console.log(OrderId, "orderid");

      const Cancelsigle = await Order.findOne({ _id: OrderId });

      let productid = Cancelsigle.products[index].productId;

      console.log(productid, "productid");
      console.log("products:", products);
      console.log("products[index]", Cancelsigle.products[index].productId);

      console.log("jhjhv", Cancelsigle);
      if (Cancelsigle) {
        await Order.updateOne(
          {
            _id: OrderId,
            "products.productId": Cancelsigle.products[index].productId,
          },
          { $set: { "products.$.status": "Cancelled" } }
        );
        res.json({ msg: "Your Order Cancelled" });

        //increment the product quantity ,
        await products.updateOne(
          { _id: productid },
          { $inc: { AvailableQuantity: 1 } }
        );
      }
    } catch (err) {
      console.log(err);
    }
  },

  //Return orderproduct
  ReturnOrder: async (req, res) => {
    try {
      // console.log(req.body, "What was the Problem .....");
      const orederdeatail = await Order.findOne({ _id: req.body.OrderId });
      console.log("This user order ", orederdeatail, "this is user order ");
      const data = {
        userId: req.body.userId,
        orderId: req.body.OrderId,
        productId: req.body.productId,
        returnReason: req.body.reason,
        Description: req.body.Description,
      };
      console.log(data);
      //save  this data in return model
      await Return.create(data);

      //after change the product status
      await Order.updateOne(
        {
          _id: req.body.OrderId,
        },
        {
          $set: { "products.$[elem].status": "Return Requested" },
        },
        {
          arrayFilters: [{ "elem.productId": req.body.productId }],
        }
      );

      res.redirect("/Myorderpage");
    } catch (err) {
      console.log("Something problem in Return order", err);
    }
  },
};
