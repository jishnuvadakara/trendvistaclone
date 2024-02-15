const mongoose=require('mongoose')
require('dotenv').config()

const Schema=mongoose.Schema

const cartModel = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productcollection",
      },
      quantity: { type: Number },
      Price: { type: Number },
    },
  ],
});

const  cart=mongoose.model('CartCollection',cartModel)
module.exports=cart