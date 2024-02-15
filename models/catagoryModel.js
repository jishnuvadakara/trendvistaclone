const mongoose=require('mongoose')
require('dotenv').config()

const Schema=mongoose.Schema
 const catagaorySchema=new Schema(
    {
        catagoryname:{
            type:String
        }
    },
    {
        timestamps:true
    }
 )  
 const catagories=mongoose.model("catagory",catagaorySchema)
 module.exports=catagories