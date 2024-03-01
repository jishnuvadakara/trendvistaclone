const mongoose=require('mongoose')
require('dotenv').config()

const Schema=mongoose.Schema
 const catagaorySchema=new Schema(
    {
        catagoryname:{
            type:String
        },
        status:{
            type:String,
            default:'active'
        }
    },
    {
        timestamps:true
    }
 )  
 const catagories=mongoose.model("catagory",catagaorySchema)
 module.exports=catagories