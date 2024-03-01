const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  wallet: {
    type: Number,
  },
  invaited: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const wallet = mongoose.model("walletCollection", walletSchema);
module.exports = wallet;
