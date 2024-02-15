const Coupon=require('../models/couponModel')
const Orders=require('../models/orderModel')



module.exports={

    GetCoupon:async (req,res)=>{
        try{


            res.render('Admin/coupon')

        }catch(err){
            console.log(err);
        }
    }

}





