const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const moment = require("moment");

module.exports = {
  //Get the Dashboard with datas


  GetDashboard: async (req, res) => {
    try {
      const [Sale, Revenue, Customers, RecentOrders, Topselling] =
        await Promise.all([
          Order.aggregate([
            { $match: { orderStatus: "Order Delivered" } },
            { $group: { _id: null, salescount: { $sum: 1 } } },
          ]),

          Order.aggregate([
            { $match: { payementStatus: "Paid" } },
            { $group: { _id: null, Revenue: { $sum: "$totalAmount" } } },
          ]),
          User.countDocuments(),

          Order.find().sort({ orderDate: -1 }).limit(5),

          Order.aggregate([
            { $unwind: "$products" },
            {
              $group: {
                _id: "$products.productId",
                TotalQuantity: { $sum: "$products.quantity" },
              },
            },
            {
              $lookup: {
                from: "productcollection",
                localField: "_id",
                foreignField: "_id",
                as: "productDetail",
              },
            },
            { $sort: { TotalQuantity: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                TotalQuantity: 1,
                productDetail: { $arrayElemAt: ["$productDetail", 0] },
              },
            },
          ]),
        ]);

      
      console.log(Topselling, "this is toselling products ");

      console.log("Resend Orders", RecentOrders, "Resend product");
      RecentOrders.forEach((ele, index) => {
        console.log(ele.userId);
      });
      console.log(Customers, "counting the coustomer");

      res.render("Admin/dashboard", { Sale, Revenue, Customers, RecentOrders });
    } catch (err) {
      console.log("Some problem Handle the Dashboard ....", err);
    }
  },
  // counting the chart

  getCount: async (req, res) => {
    try {
      //console the ajax response req.url
      // console.log(req.url);
      const orders = await Order.find({
        orderStatus: { $nin: ["Order Rejected", "Cancelled"] },
      });
      console.log("okk");
      const orderCountsByDay = {};
      const totalAmountByDay = {};
      const orderCountsByMonthYear = {};
      const totalAmountByMonthYear = {};
      const orderCountsByYear = {};
      const totalAmountByYear = {};
      let labelsByCount;
      let labelsByAmount;
      let dataByCount = [];
      let dataByAmount = [];

      // Rest of the code remains unchanged

      //
      console.log("ok2");

      console.log(orders, "oreders");
      orders.forEach((order) => {
        const orderDate = moment(order.orderDate, "ddd MMM DD YYYY");
        const dayMonthYear = orderDate.format("YYYY-MM-DD");
        const monthYear = orderDate.format("YYYY-MM");
        const year = orderDate.format("YYYY");
        console.log(req.url, "kokk");
        console.log("ok3");

        if (req.url === "/count-orders-by-day") {
          if (!orderCountsByDay[dayMonthYear]) {
            orderCountsByDay[dayMonthYear] = 1;
            totalAmountByDay[dayMonthYear] = order.totalAmount;
          } else {
            orderCountsByDay[dayMonthYear]++;
            totalAmountByDay[dayMonthYear] += order.totalAmount;
          }

          const ordersByDay = Object.keys(orderCountsByDay).map(
            (dayMonthYear) => ({
              _id: dayMonthYear,
              count: orderCountsByDay[dayMonthYear],
            })
          );

          const amountsByDay = Object.keys(totalAmountByDay).map(
            (dayMonthYear) => ({
              _id: dayMonthYear,
              total: totalAmountByDay[dayMonthYear],
            })
          );

          amountsByDay.sort((a, b) => (a._id < b._id ? -1 : 1));
          ordersByDay.sort((a, b) => (a._id < b._id ? -1 : 1));

          labelsByCount = ordersByDay.map((entry) =>
            moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
          );
          console.log(labelsByCount, "this is oke");

          labelsByAmount = amountsByDay.map((entry) =>
            moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
          );
          console.log(labelsByAmount, "this is oke ");

          dataByCount = ordersByDay.map((entry) => entry.count);
          dataByAmount = amountsByDay.map((entry) => entry.total);
        } else if (req.url === "/count-orders-by-month") {
          if (!orderCountsByMonthYear[monthYear]) {
            orderCountsByMonthYear[monthYear] = 1;
            totalAmountByMonthYear[monthYear] = order.totalAmount;
          } else {
            orderCountsByMonthYear[monthYear]++;
            totalAmountByMonthYear[monthYear] += order.totalAmount;
          }

          const ordersByMonth = Object.keys(orderCountsByMonthYear).map(
            (monthYear) => ({
              _id: monthYear,
              count: orderCountsByMonthYear[monthYear],
            })
          );
          const amountsByMonth = Object.keys(totalAmountByMonthYear).map(
            (monthYear) => ({
              _id: monthYear,
              total: totalAmountByMonthYear[monthYear],
            })
          );

          ordersByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
          amountsByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));

          labelsByCount = ordersByMonth.map((entry) =>
            moment(entry._id, "YYYY-MM").format("MMM YYYY")
          );
          labelsByAmount = amountsByMonth.map((entry) =>
            moment(entry._id, "YYYY-MM").format("MMM YYYY")
          );
          dataByCount = ordersByMonth.map((entry) => entry.count);
          dataByAmount = amountsByMonth.map((entry) => entry.total);
        } else if (req.url === "/count-orders-by-year") {
          if (!orderCountsByYear[year]) {
            orderCountsByYear[year] = 1;
            totalAmountByYear[year] = order.totalAmount;
          } else {
            orderCountsByYear[year]++;
            totalAmountByYear[year] += order.totalAmount;
          }

          const ordersByYear = Object.keys(orderCountsByYear).map((year) => ({
            _id: year,
            count: orderCountsByYear[year],
          }));
          const amountsByYear = Object.keys(totalAmountByYear).map((year) => ({
            _id: year,
            total: totalAmountByYear[year],
          }));

          ordersByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
          amountsByYear.sort((a, b) => (a._id < b._id ? -1 : 1));

          labelsByCount = ordersByYear.map((entry) => entry._id);
          labelsByAmount = amountsByYear.map((entry) => entry._id);
          dataByCount = ordersByYear.map((entry) => entry.count);
          dataByAmount = amountsByYear.map((entry) => entry.total);
        }
      });
      console.log(labelsByCount, labelsByAmount, dataByCount, dataByAmount);
      res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });
    } catch (err) {
      console.log("mistake in Chart controlling ", err);
    }
  },
};
