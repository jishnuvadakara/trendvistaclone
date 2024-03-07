const multer=require('multer')
const path=require('path')
const { updateMany } = require('../models/catagoryModel')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/productimages')
        console.log('reached multer');
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
        cb(null,`${uniqueSuffix}_${file.originalname}`)
    }
})  
const Upload=multer({storage})
module.exports=Upload
