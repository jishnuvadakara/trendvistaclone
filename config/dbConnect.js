const mongoose  = require("mongoose")
 require("dotenv").config();

//  const dbconnect=mongoose.connect(process.env.MONGOURL).then(()=>{
//     console.log("Database connected")
// }).catch((err)=>console.log("Connection Failed",err))
const dbconnect=()=>{
    try{
       const conn= mongoose.connect(process.env.MONGOURL)
        console.log("Database is connected");
    }catch(err){
        console.log("Database is Not Connected");
    }
}

module.exports=dbconnect;
