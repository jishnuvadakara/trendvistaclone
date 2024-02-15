const mongoose=require('mongoose')

const Schema=mongoose.Schema

const addressdata= new Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId
        },
        name:{
            type:String
        },
        mobile:{
            type:String
        },
        email:{
            type:String
        },
        address:{
            type:String
        },
        pincode:{
            type:String
        },
        locality:{
            type:String
        },
        city:{
            type:String
        },
        district:{
            type:String
        },
        state:{
            type:String
        },
        addressType:{
            type:String
        }

        }
)
const address=mongoose.model("address",addressdata)
module.exports=address