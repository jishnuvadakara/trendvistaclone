const mongoose=require('mongoose')

const Schema=mongoose.Schema

const Couponmongoose = new Schema({
  userId:{type:mongoose.Schema.Types.ObjectId},
  couponCode:{type:String},
  description:{type:String},
  minimumPurachaseAmount:{type:Number},
  discounAmount:{type:Number},
  validFrom:{type:Date},
  validTo:{type:Date}

});

const Coupon=mongoose.model("CouponCollection",Couponmongoose)
module.exports=Coupon
