const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Catagory = require("../models/catagoryModel");
const { generateSalesPDF } = require("../util/salesPdfCreator");
const pdf = require("../util/salesReportX");
const moment = require("moment");
const { format } = require("date-fns");
const catagories = require("../models/catagoryModel");
// const { default: items } = require("razorpay/dist/types/items");
// const { default: orders } = require("razorpay/dist/types/orders");

module.exports = {
  //Get the Dashboard with datas

  GetDashboard: async (req, res) => {
    try {
      const sussMsg = req.session.adminMistake;
      const [
        Sale,
        Revenue,
        Customers,
        RecentOrders,
        Topselling,
        topsellingCat,
        TopsellingBarnd,
      ] = await Promise.all([
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
              from: "productcollections",
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
        Order.aggregate([
          { $unwind: "$products" },

          {
            $lookup: {
              from: "productcollections",
              localField: "products.productId",
              foreignField: "_id",
              as: "productDetail",
            },
          },

          { $unwind: "$productDetail" },

          {
            $project: {
              _id: "$productDetail.catagory",
              TotalQuantity: "$products.quantity",
              productName: "$productDetail.productName",
              Price: "$productDetail.Price",
              Description: "$productDetail.Description",
            },
          },

          {
            $group: {
              _id: "$_id",
              TotalQuantity: { $sum: "$TotalQuantity" },
            },
          },

          { $sort: { TotalQuantity: -1 } },

          { $limit: 3 },
        ]),
        Order.aggregate([
          { $unwind: "$products" },
          {
            $lookup: {
              from: "productcollections",
              localField: "products.productId",
              foreignField: "_id",
              as: "productDetail",
            },
          },
          { $unwind: "$productDetail" },
          {
            $group: {
              _id: "$productDetail.BrandName",
              TotalQuantity: { $sum: "$products.quantity" },
            },
          },
          { $sort: { TotalQuantity: -1 } },
          { $limit: 3 },
        ]),
      ]);

      const result = await Promise.all(
        topsellingCat.map(async (item) => {
          try {
            const category = await Catagory.findById(item._id);
            return {
              categoryName: category.catagoryname,
              totalQuantity: item.TotalQuantity,
            };
          } catch (error) {
            console.error("Error finding category:", error);
            return null;
          }
        })
      );

      console.log("this is ", result, "this tish ");

      console.log(topsellingCat, "this for top selling catagory -2");
      console.log("this is for topselling brand", TopsellingBarnd, "this is ");

      console.log(Topselling, "this is toselling products ");

      // console.log("Resend Orders", RecentOrders, "Resend product");
      RecentOrders.forEach((ele, index) => {
        console.log(ele.userId);
      });
      // console.log(Customers, "counting the coustomer");

      res.render("Admin/dashboard", {
        Sale,
        Revenue,
        Customers,
        RecentOrders,
        Topselling,
        sussMsg,
        result,
        TopsellingBarnd,
      });
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
      console.log(labelsByCount, "labelsByCount");
      res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });
    } catch (err) {
      console.log("mistake in Chart controlling ", err);
    }
  },

  Salesrepot: async (req, res) => {
    try {
      console.log(req.body);
      const { StartDate, EndDate, downloadFormat, Year } = req.body;
      let StartDates = 0;
      let EndDates = 0;
      console.log("staring Date", StartDates, "ending Date", EndDates);

      if (Year == "Today") {
        let currentDate = new Date().toISOString().split("T")[0];
        console.log(
          "🚀 ~ file: dashboardController.js:321 ~ Salesrepot: ~ currentDate:",
          currentDate
        );
        StartDates = currentDate;
        EndDates = currentDate;
        console.log(
          "🚀 ~ file: dashboardController.js:325 ~ Salesrepot: ~ EndDate:",
          EndDate
        );
      } else if (Year == "Month") {
        let currentDate = new Date();
        let currentMonthIndex = currentDate.getMonth(); // Get the current month index (0-11)
        let currentMonth = currentMonthIndex + 1; //* find the current month index
        let IndexOfMonth = [1, 3, 5, 7, 8, 10, 12];
        if (IndexOfMonth.includes(currentMonth)) {
          console.log("working-31");
          StartDates=`2024-0${currentMonth}-01`
          EndDates=`2024-0${currentMonth}-31`
        } else {
          console.log("working -30");
             StartDates = `2024-0${currentMonth}-01`;
             EndDates = `2024-0${currentMonth}-30`;
        }
      }else if(Year=='Week'){
        // Get the current date
        let currentDate = new Date();

        // Subtract 6 days from the current date
        let previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 6);
        StartDates = previousDate.toISOString().split("T")[0];
        EndDates=new Date().toISOString().split("T")[0]

        
      } else if (Year != null) {
        console.log("the year is ", Year);
        StartDates = `${Year}-01-01`;
        EndDates = `${Year}-12-31`;
        console.log(
          "🚀 ~ file: dashboardController.js:331 ~ Salesrepot: ~ StartDates:",
          StartDates
        );
        console.log(
          "🚀 ~ file: dashboardController.js:332 ~ Salesrepot: ~ EndDates:",
          EndDates
        );
      } else {
        StartDates = StartDate;
        EndDates = EndDate;
      }

      // Find orders within the specified date range
      const orders = await Order.find({
        payementStatus: "Paid",
        orderDate: { $gte: StartDates, $lte: EndDates },
      }).populate("products.productId");
      console.log(
        "🚀 ~ file: dashboardController.js:340 ~ Salesrepot: ~ orders:",
        orders
      );

      // Check if Orders are found
      if (orders.length === 0) {
        // res.redirect("/Admin/dashboard");
        // res.json({mistake:"ther have no order"})
        req.session.adminMistake = "there is no order for  this day";
      }

      let totalSales = 0;

      orders.forEach((order) => {
        totalSales += order.discountAmount || 0;
      });

      if (downloadFormat.toLowerCase() === "pdf") {
        // Generate PDF report
        const pdfBuffer = await generateSalesPDF(orders, StartDates, EndDates);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment;filename=salesReport.pdf"
        );

        return res.status(200).end(pdfBuffer);
      } else if (downloadFormat.toLowerCase() === "excel") {
        // Generate Excel report
        await pdf.downloadReport(
          req,
          res,
          orders,
          StartDate,
          EndDate,
          totalSales.toFixed(2),
          downloadFormat
        );
      } else {
        return res.status(400).send("Invalid download format");
      }
    } catch (err) {
      console.log("Error in Salesrepot:", err);
      return res.status(500).send("Internal server error");
    }
  },
};
