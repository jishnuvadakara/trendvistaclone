const mongoose=require('mongoose')

const Schema=mongoose.Schema

const wishlistSchema= new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId
    },
    products:[
        {
        productId:{type:mongoose.Schema.Types.ObjectId,ref:"productcollection"},

        }
    ]

})

const wishlist=mongoose.model("wishliscollection",wishlistSchema)
module.exports=wishlist