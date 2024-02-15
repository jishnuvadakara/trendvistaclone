const mongoose=require('mongoose')
// require('dotenv').config()

const Schema=mongoose.Schema

const brandSchema= new Schema(
    {
        Brandname:{
            type:String
        }
},
{
    timestamps:true
}
)
const Brand=mongoose.model("Brandname",brandSchema)
module.exports=Brand