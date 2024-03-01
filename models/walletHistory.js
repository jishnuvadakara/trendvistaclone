const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const walletHistoySchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  refund: [
    {
      amount: { type: Number },
      reason: { type: String },
      type:{type:String},
      date:{type:Date}
    },
  ],
});

const walletHistory=mongoose.model("walletHistoryCollection",walletHistoySchema)
module.exports=walletHistory