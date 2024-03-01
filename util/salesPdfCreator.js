// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const moment = require("moment");
// const { resolve } = require("path");
// const { rejects } = require("assert");
// const { error } = require("console");
// const Order = require("../models/orderModel");

// //Table Row with bottom line

// function generateTableRow(doc, y, c1, c2, c3, c4, c5, c6, c7) {
//   doc
//     .fontSize(7)
//     .text(c1, 40, y)
//     .text(c2, 70, y)
//     .text(c3, 180, y)
//     .text(c4, 300, y)
//     .text(c5, 400, y)
//     .text(c6, 470, y)
//     .text(c7, 0, y, { align: "right" })
//     .moveTo(50, y + 15)
//     .lineTo(560, y + 15)
//     .lineWidth(0.5)
//     .strokeColor("#ccc")
//     .stroke();
// }

// //Table row without bottom line

// function generateTableRowNoLine(doc, y, c1, c2, c3, c4, c5) {
//   doc
//     .fontSize(7)
//     .text(c1, 100, y)
//     .text(c2, 100, y)
//     .text(c3, 420, y, { width: 90, align: "right" })
//     .text(c4, 200, y, { width: 90, align: "right" })
//     .text(c5, 0, y, { align: "right" });
// }

// //Generating Report

// const generateSalesPDF = async (Orders, StartDate, EndDate) => {
//   return new Promise((resolve, reject) => {
//     try {
//       let doc = new PDFDocument({ margin: 50 });

//       const buffers = [];
//       doc.on("data", (buffer) => buffers.push(buffer));
//       doc.on("end", () => resolve(Buffer.concat(buffers)));
//       doc.on("error", (error) => reject(error)); // Fixed typo here

//       // Products
//       // Footer for the PDF
//       doc
//         .fontSize(15)
//         .text(
//           `Sales Report ${
//             StartDate.toLocaleDateString() +
//             " " +
//             StartDate.toLocaleTimeString()
//           } to ${
//             EndDate.toLocaleDateString() + " " + EndDate.toLocaleTimeString()
//           }`,
//           50,
//           50,
//           {
//             align: "center",
//             width: 500,
//             color: "white",
//             backgroundColor: "gray",
//           }
//         );

//       // Corrected variable name here
//       const invoiceTableTop = 100;

//       // Table Header
//       generateTableRow(
//         doc,
//         invoiceTableTop,
//         "SL No",
//         "Order ID",
//         "User ID",
//         "Order Date",
//         "Payment Method",
//         "coupon Amount",
//         "Amount"
//       );

//       let i = 0;
//       let sum = 0;
//       Orders.forEach((x) => {
//         var position = invoiceTableTop + (i + 1) * 30;
//         sum += x.totalAmount;
//         sum -= x.couponDiscount;
//         generateTableRow(
//           doc,
//           position,
//           i + 1,
//           x._id,
//           x.userId,
//           x.orderDate.toLocaleDateString() + x.orderDate.toLocaleTimeString(),
//           x.payementMethod,
//           x.couponDiscount,
//           x.totalAmount || x.discountAmount
//         );
//         i++;
//       });

//       //Summary row
//       const subtotalPosition = invoiceTableTop + Orders.length * 30;
//       const paidToDatePosition = subtotalPosition + 30;

//       const duePosition = subtotalPosition + 30;
//       generateTableRowNoLine(doc, duePosition, "", "", "Total", "", sum);

//       // End the document
//       doc.end();
//     } catch (error) {
//       console.log(error, "something mistake in generateSalesPdf");
//       reject(error);
//     }
//   });
// };

// module.exports = { generateSalesPDF };

const PDFDocument = require("pdfkit");
const moment = require("moment");

//Table Row with bottom line
function generateTableRow(doc, y, c1, c2, c3, c4, c5, c6, c7) {
  doc
    .fontSize(7)
    .text(c1, 40, y)
    .text(c2, 70, y)
    .text(c3, 180, y)
    .text(c4, 300, y)
    .text(c5, 400, y)
    .text(c6, 470, y)
    .text(c7, 0, y, { align: "right" })
    .moveTo(50, y + 15)
    .lineTo(560, y + 15)
    .lineWidth(0.5)
    .strokeColor("#ccc")
    .stroke();
}

//Table row without bottom line
function generateTableRowNoLine(doc, y, c1, c2, c3, c4, c5) {
  doc
    .fontSize(7)
    .text(c1, 100, y)
    .text(c2, 100, y)
    .text(c3, 420, y, { width: 90, align: "right" })
    .text(c4, 200, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}

//Generating Report
const generateSalesPDF = async (Orders, StartDate, EndDate) => {
  return new Promise((resolve, reject) => {
    try {
      let doc = new PDFDocument({ margin: 50 });

      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (error) => reject(error));

      // Footer for the PDF
      doc
        .fontSize(15)
        .text(
          `Sales Report ${moment(StartDate).format(
            "YYYY-MM-DD HH:mm:ss"
          )} to ${moment(EndDate).format("YYYY-MM-DD HH:mm:ss")}`,
          50,
          50,
          {
            align: "center",
            width: 500,
            color: "white",
            backgroundColor: "gray",
          }
        );

      const invoiceTableTop = 100;

      // Table Header
      generateTableRow(
        doc,
        invoiceTableTop,
        "SL No",
        "Order ID",
        "User Name",
        "Order Date",
        "Payment Method",
        "Coupon Amount",
        "Amount"
      );

      let i = 0;
      let sum = 0;
      Orders.forEach((x) => {
        var position = invoiceTableTop + (i + 1) * 30;
        sum += x.totalAmount;
        // sum -= x.couponDiscount;
        generateTableRow(
          doc,
          position,
          i + 1,
          x._id,
          x.address.name,
          moment(x.orderDate).format("YYYY-MM-DD HH:mm:ss"),
          x.payementMethod,
          x.couponDiscount,
          x.totalAmount || x.discountAmount
        );
        console.log(x.totalAmount, "here is total amount ");
        i++;
      });

      console.log(sum, "this sum of the order");
      //Summary row
      const duePosition = invoiceTableTop + Orders.length * 30 + 30;
      generateTableRowNoLine(doc, duePosition, "", "", "Total", "", sum);

      // End the document
      doc.end();
    } catch (error) {
      console.log(error, "something mistake in generateSalesPdf");
      reject(error);
    }
  });
};

module.exports = { generateSalesPDF };
