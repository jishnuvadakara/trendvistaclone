const User = require("../models/userModel");
const catagories = require("../models/catagoryModel");
const Brand = require("../models/brandModel");
const products = require("../models/productModel");
const Orders = require("../models/orderModel");
const Order = require("../models/orderModel");
const Return = require("../models/returnModel");

module.exports = {
  getCustomer: async (req, res) => {
    try {
      console.log(
        "customers----------------------------------------------------------------------------"
      );
      const data = await User.find();
      res.render("Admin/userlist", { user: data });
    } catch (err) {
      console.log(err);
    }
  },
  updateUser: async (req, res) => {
    try {
      console.log(
        "update----------------------------------------------------------------------------"
      );
      const id = req.params.id;
      const status = req.params.status;
      console.log(status);
      var msg;
      const detail = await User.findOne({ _id: id });
      if (detail.status == "active") {
        await User.updateOne({ _id: id }, { $set: { status: "block" } });
        msg = "block";
      } else {
        await User.updateOne({ _id: id }, { $set: { status: "active" } });
        msg = "unblock";
      }

      res.json({ msg: `${msg} successfully` });
    } catch (err) {
      console.log("yes come: Update place", err);
    }
  },
  //search user-------------------------------------
  SearchUser: async (req, res) => {
    try {
      const searchData = req.body;
      console.log(searchData);
      console.log(searchData.search, "yes this is");

      const user = await User.find({
        name: { $regex: "^" + searchData.search, $options: "i" },
      });
      res.render("Admin/userlist", { user });
    } catch (err) {
      console.log("search side", err);
    }
  },

  // catagory page
  getCatagory: async (req, res) => {
    try {
      // const index=0
      const [catagory, Brands] = await Promise.all([
        catagories.find(),
        Brand.find(),
      ]);
      // console.log("server is ok ",catagories);
      res.render("admin/catagory", { catagory, Brands });
    } catch (err) {
      console.log("come up catagory", err);
    }
  },
  //-------------Product controller----------------------------------------
  getProduct: async (req, res) => {
    try {
      const data = await products.find().populate("catagory");
      res.render("admin/product", { data });
    } catch (Err) {
      console.log(Err);
    }
  },
  //--------------------------------------------------------------------------------------Ordrer details----------------------------------------------------------------------------------------------

  GetAdminOrders: async (req, res) => {
    try {
      const orders = await Orders.aggregate([
        {
          $lookup: {
            from: "User",
            localField: "userId",
            foreignField: "_id",
            as: "userName",
          },
        },
        { $sort: { orderDate: -1 } },
        {
          $project: {
            username: { $arrayElemAt: ["$userName.username", 0] }, // Extract username from the array
            userId: 1,
            products: 1,
            address: 1,
            orderDate: 1,
            expectedDeliveryDate: 1,
            payementMethod: 1,
            payementStatus: 1,
            totalAmount: 1,
            deliveryDate: 1,
            orderStatus: 1,
            couponDiscount: 1,
            couponCode: 1,
            discountAmount: 1,
          },
        },
      ]);

      const ReturnDetail = await Return.find();
      let RequestProduct = orders.some((order) => {
        return order.products.some((product) => {
          return product.status === "Return Requested";
        });
      });
      if (RequestProduct) {
        console.log("its codition is working ");
      } else {
        console.log("its not work ");
      }

      console.log(RequestProduct, "thishtisthisthsithsithstisht");

      // console.log(ReturnDetail,'this Return stattus');
      // console.log("Number of documents in 'orders' array:", orders.length);
      // console.log("Orders:", orders);

      res.render("Admin/adminOrders", { orders, ReturnDetail });
    } catch (err) {
      console.log(err);
    }
  },

  //--------------
  ChangeOrderStatus: async (req, res) => {
    try {
      console.log(req.params);
      const { OrderId, status } = req.params;
      console.log(OrderId);

      const orderdetail = await Orders.findOne({ _id: OrderId });
      if (orderdetail) {
        await Orders.updateOne(
          { _id: OrderId },
          { $set: { orderStatus: status } }
        );
        res.json({ msg: "Chage the status" });
      }
      if (status == "Order Delivered") {
        await Orders.updateOne(
          { _id: OrderId },
          { $set: { payementStatus: "Paid" } }
        );
      }
    } catch (err) {
      console.log("mistake in status changed ", err);
    }
  },

  //accept Return status
  Orderlist: async (req, res) => {
    try {
      console.log(req.params, "this is order id");
      const [orderList, ReturnRequest] = await Promise.all([
        Order.findOne({ _id: req.params.id }),
        Return.find({ orderId: req.params.id }),
      ]);

      const orderprodcut = orderList.products;
      console.log(orderprodcut, "orderproducts");
      console.log(orderList, "orderlist");
      console.log(ReturnRequest, "this is return");
      res.render("Admin/SingleOrderList", {
        orderList,
        ReturnRequest,
        orderprodcut,
      });
    } catch (err) {
      console.log(err, "any mistake check in return  function");
    }
  },
  ReturnAccept:async(req,res)=>{
    try{
      console.log(req.body);

      const {OrderId,productId,reason}=req.body
      if(reason=='Accept'){

        await Return.updateOne({productId:productId},{$set:{status:reason}})


            await Order.updateOne(
              {
                _id: OrderId,
              },
              {
                $set: { "products.$[elem].status": "Return Accepted" },
              },
              {
                arrayFilters: [{ "elem.productId": productId }],
              }
            );
            res.redirect("/Admin/OrderDetails");




      }else{
        await Return.deleteOne({Orderid:OrderId})
         res.redirect("/Admin/OrderDetails");
      }



    }catch(err){
      console.log("accept time error ",err);
    }
  }

};
