const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  feedbackStar:{type:Number},
  Userresponse:{type:String},
  AdminResponse:{type:String,
      default:"No response"  
  }


});

const feedback=mongoose.model('Companyfeedback',FeedbackSchema)
module.exports=feedback