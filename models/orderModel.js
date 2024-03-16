const mongoose = require("mongoose");
require("dotenv").config();

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productcollection",
      },
      quantity: {
        type: Number,
      },
      status: {
        type: String,
        default: "Order Processing",
      },
      
    },
  ],
  address: {
    name: String,
    address: String,
    city: String,
    pincode: String,
    district: String,
    state: String,
    locality: String,
    addressType: String,
    mobile: Number,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  expectedDeliveryDate: Date,
  payementMethod: String,
  payementStatus: String,
  totalAmount: Number,
  deliveryDate: Date,
  orderStatus: String,
  couponDiscount: Number,
  couponCode: String,
  discountAmount: Number,
});

const Order = mongoose.model("OrderCollection", orderSchema);

module.exports = Order;


// Price: {
//         type: Number,
//       }