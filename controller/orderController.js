const Order = require("../models/orderModel");
const Address = require("../models/addressModel");
const Products = require("../models/productModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Return = require("../models/returnModel");
const products = require("../models/productModel");
const wallet = require("../models/walletModal");
const walletHistory = require("../models/walletHistory");
const { disconnect } = require("mongoose");
const { CreateRazorpayOrder } = require("../controller/razorpayController");
const { generateInvoice } = require("../util/InvoiceCreator");
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
      const CouponDiscount = req.session.discountAmount;
      const CouponCode = req.session.CouponCode;
      console.log("this is delivery charge decrese total amount ", Grandtotal);
      console.log(
        CouponDiscount,
        "coupon Discount amount",
        CouponCode,
        "This is Coupon code "
      );

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
          CouponDiscount,
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
      const couponCode = req.session.CouponCode;
      const CouponDiscount = req.session.discountAmount;

      console.log(addressId);
      console.log(req.params);
      const payementmethod = req.params.type;
      console.log(payementmethod);

      console.log(
        req.session.adressId,
        "this  is the address what will happend"
      );

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
          couponCode: couponCode,
          couponDiscount: CouponDiscount,
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
          payementStatus: "Pending",
          totalAmount: Grandtotal,
          discountAmount: Discount,
          orderStatus: "Order Processing",
          couponDiscount: CouponDiscount,
          couponCode: couponCode,
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
      } else if (
        payementmethod == "walletPayment" &&
        req.session.adressId != undefined
      ) {
        console.log("wallet option is working ");
        const Userin = await User.findOne({ email: UserEmail });
        const UserwalletIn = await wallet.findOne({ userId: Userin._id });
        console.log(
          Userin,
          "this for user data ",
          Userin,
          "this for userwallet data ",
          UserwalletIn,
          "this is for usr wallet "
        );
        if (UserwalletIn && UserwalletIn.wallet >= Grandtotal) {
          console.log("this corect ");
          await wallet.updateOne({userId:Userin._id},{$inc:{wallet:-Grandtotal}})

          const [addressUser, cartUser] = await Promise.all([
            Address.findOne({ userId: Userin._id }),
            Cart.findOne({ userId: Userin._id }),
          ]);
          console.log(
            "user addreass",
            addressUser,
            "secod one ise user Cat",
            cartUser
          );

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

          let myorder = {
            userId: Userin._id,
            products: cartUser.products,
            address: {
              address: addressUser.name,
              address: addressUser.address,
              city: addressUser.city,
              pincode: addressUser.pincode,
              district: addressUser.district,
              state: addressUser.state,
              locality: addressUser.locality,
              addressType: addressUser.addressType,
              mobile: addressUser.mobile,
            },
            orderDate: currentDate,
            expectedDeliveryDate: DeliveryDate,
            payementMethod: payementmethod,
            payementStatus: "pending",
            totalAmount: Grandtotal,
            discountAmount: Discount,
            orderStatus: "Order Processing",
            couponDiscount: CouponDiscount,
            couponCode: couponCode,
          };
          console.log("this is for order creating ", myorder);
           await Order.create(myorder)

          //after that decrease the product quatity
          const Carprodct = cartUser.products;

          for (let data of Carprodct) {
            try {
              let dataId = data.productId;

              const dataIddetail = await products.findOne({ _id: dataId });
              console.log("this is for the dataIddetail", dataIddetail);

              let oldQuantity = dataIddetail.AvailableQuantity;
              let cartQuantity = data.quantity;

              let newQuantity = oldQuantity - cartQuantity;
              console.log(
                "this is the new quantity of the products",
                newQuantity
              );

              await products.updateOne(
                { _id: dataId },
                { $set: { AvailableQuantity: newQuantity } }
              );

              req.session.UsercartId = cartUser._id;
            } catch (err) {
              console.log(
                "something problem in user update product quantity",
                err
              );
            }
          }
          const userwalletHistory = await walletHistory.findOne({
            userId: Userin._id,
          });
          if (userwalletHistory) {
            console.log("user have alreay wallethistory");
            const reason = "Product Purchase With Wallet Amount";
            let type = "debit";
            let date = new Date();

            await walletHistory.updateOne(
              { userId: Userin._id },
              {
                $push: {
                  refund: {
                    amount: Grandtotal,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                },
              },
              { new: true }
            );
          }else{
            console.log('user have no wallet');
            let reason = "Product Purchase With Wallet Amount";
            let type='debit'
            let date=new Date()
            await walletHistory.create({userId:Userin._id},{refund:[{amount:amount,reason:reason,type:type,date:date}]})
          }
          await Cart.findByIdAndDelete(cartUser._id)
          res.json({ payment: "wallet" });
        } else {
          res.json({ msg: "Insufficient Balance in Wallet" });
          console.log("thsi not grater then but correct");
        }
        //find the user address and user cart
      } else {
        res.status(404);
        console.log(
          "something problem in check page or checkout page payment selecting side "
        );
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
      const ITEMS_PER_PAGE = 4;
      const TotalPrice = req.session.Totalamnt;
      const Grandtotal = req.session.Grandamnt;

      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter, default to 1 if not provided
      const skip = (page - 1) * ITEMS_PER_PAGE; // Calculate the number of documents to skip

      const [MyorderCount, Myorder] = await Promise.all([
        Order.countDocuments({ userId: req.session.user_Id }),
        Order.find({ userId: req.session.user_Id })
          .populate("products.productId")
          .sort({ orderDate: -1 })
          .skip(skip)
          .limit(ITEMS_PER_PAGE),
      ]);

      const totalPages = Math.ceil(MyorderCount / ITEMS_PER_PAGE); // Calculate total pages
      console.log(Myorder.length, "user order is empty");

      res.render("user/Myorder", {
        Myorder,
        TotalPrice,
        Grandtotal,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < MyorderCount,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: totalPages,
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

  //INvoice ------------------------------------------------------------------------------------------Invoice--------------------------------
  getInvoice: async (req, res) => {
    try {
      console.log(req.params);
      const { orderId, index } = req.params;
      const orderDetail = await Order.findOne({ _id: orderId }).populate(
        "products.productId"
      );
      const Deliverproduct = orderDetail.products.filter(
        (prodcut) => prodcut.status == "Order Delivered"
      );
      console.log(Deliverproduct, "its filter is working ");
      if (orderDetail) {
        const invoicepath = await generateInvoice(
          orderDetail,
          index,
          Deliverproduct
        );
        res.json({
          success: true,
          message: "Invoice generated successfully",
          invoicepath,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Invoice generated failed" });
      }

      console.log("generate invoice fuction is working ");
    } catch (err) {
      console.log(err);
    }
  },
  downloadinginvoice: async (req, res) => {
    try {
      console.log(req.params);
      const id = req.params.orderId;
      const filePath = `public/invoicePdf/${id}.pdf`;

      res.download(filePath, `invoice_${id}.pdf`);
    } catch (err) {
      console.log(err);
    }
  },
  //The function for payment option for online payment failed order
  RazorpayFaledOrder: async (req, res) => {
    try {
      console.log("req.params", req.params);
      const { OrderId } = req.params;

      const OrderFailed = await Order.findOne({ _id: OrderId });
      console.log("this is for Failed razorpay", OrderFailed);
      const Grandtotal = OrderFailed.totalAmount;
      console.log("this is for grand total amount", Grandtotal);
      CreateRazorpayOrder(res, OrderFailed._id, Grandtotal);
    } catch (err) {
      console.log("Problem with your logic", err);
    }
  },
};
