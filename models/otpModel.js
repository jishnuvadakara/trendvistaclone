const mongoose=require('mongoose')
require('dotenv').config()

const Schema=mongoose.Schema;

const otpSchema=new Schema(
    {
        email:{
            type:String,
            unique:true
        },
        otp:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

const otps=mongoose.model("otp",otpSchema)
module.exports=otps