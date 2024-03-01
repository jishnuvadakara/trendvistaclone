const easyinvoice = require("easyinvoice");
const fs = require("fs");
const path = require("path");
// const { default: invoices } = require("razorpay/dist/types/invoices");

module.exports = {
  generateInvoice: async (orderDetail, index, Deliverproduct) => {
    try {
      const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString("en-US") : " ";
      };

      const data = {
        customize: {},
        images: {},
        sender: {
          company: "Trend-Vista",
          address: "1650 Khan Market,New Delhi,FL 33160, India",
          zip: "673503",
          city: "delhi",
          country: "india",
        },
        client: {
          company: orderDetail.address.locality,
          address: orderDetail.address.address,
          zip: orderDetail.address.pincode,
          city: orderDetail.address.city,
          country: "India",
        },
        information: {
          order: orderDetail._id,

          date: formatDate(orderDetail.orderDate),

          dueDate: formatDate(orderDetail.orderDate),
        },
        products: Deliverproduct.map((product) => ({
          quantity: product.quantity.toString(),
          description: product.productId.productName,
          taxRate: 1,
          price: product.productId.DiscountAmount,
        })),
        bottomNotice: "Thank you for choosing Trend-Vista",
        settings: {
          "  currency": "INR",
          "tax-notation": "GST",
          "margin-top": 25,
          "margin-right": 25,
          "margin-left": 25,
          "margin-bottom": 25,
        },
      };
      console.log("invoice data", data);

      const result = await easyinvoice.createInvoice(data);

      if (result.pdf) {
        const pdfpath = path.join(
          __dirname,
          "..",
          "public",
          "invoicePdf",
          `${orderDetail._id}.pdf`
        );
        await fs.promises.writeFile(pdfpath, result.pdf, "base64");
        console.log("Successfull", pdfpath);
        return pdfpath;
      } else {
        console.log("Erroo in invoice pdf ",result);
        return null;
      }
    } catch (err) {
      console.log(err);
      return null
    }
  },
};
