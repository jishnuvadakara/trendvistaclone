const mongoose=require('mongoose')
require('dotenv').config()

const Schema= mongoose.Schema
 const admindata=new Schema(
    {
        name:{
            type:String
        },
        email:{
            type:String
        },
        password:{
            type:String
        },

    },
    {
        timestamps:true
    }
 )
const admins=mongoose.model("admindata",admindata)
module.exports=admins