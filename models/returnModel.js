const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReturnSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  orderId: { type: mongoose.Schema.Types.ObjectId },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "productcollection" },
  returnReason: {
    type: String,
  },
  Description: {
    type: String,
  },
  status: {
    type: String,
    default: "Requested",
  },
});

const ReturnOrder=mongoose.model("ReturnItem",ReturnSchema)

module.exports=ReturnOrder