const Coupon = require("../models/couponModel");
const Orders = require("../models/orderModel");

module.exports = {
  GetCoupon: async (req, res) => {
    try {
      //send the coupon data in admin side
      const CouponDetail = await Coupon.find();
      console.log(CouponDetail);
      res.render("Admin/coupon", { CouponDetail });
    } catch (err) {
      console.log(err);
    }
  },
  PostAddCoupon: async (req, res) => {
    try {
      const CouponDeataials = req.body;
      const offer = req.body.discountAmount;
      const acutal = req.body.minimumPurachaseAmount;
      console.log((offer / acutal) * 100, "this is orginal percengaes");
      const offerPercentage = Math.floor((offer / acutal) * 100);
      console.log(
        offer,
        "this",
        acutal,
        "total",
        offerPercentage,
        "coupon discount for percentage"
      );
      console.log(CouponDeataials);
      const Incoupon = await Coupon.findOne({
        couponCode: req.body.couponCode,
      });
      console.log(Incoupon, "this is coupon");
      if (Incoupon) {
        res.json({ msg: "This coupon already add another admin" });
      } else {
        await Coupon.create({ ...CouponDeataials, offerPercentage });
        res.json({ msg: "Succussfully Add " });
        // res.redirect("/Admin/CouponAdmin");
      }
    } catch (err) {
      console.log(err);
    }
  },
  GetEditCoupon: async (req, res) => {
    try {
      console.log("couponid", req.params, "coupon id");

      const CouponDetails = await Coupon.findOne({ _id: req.params.CouponId });
      console.log(CouponDetails, "Getedit couopon ");

      const Starting = new Date(CouponDetails.validFrom)
        .toISOString()
        .slice(0, 10);
      const Ending = new Date(CouponDetails.validTo).toISOString().slice(0, 10);

      console.log(Starting);
      console.log(Ending);

      if (CouponDetails) {
        res.json({
          CouponId: CouponDetails._id,
          couponCode: CouponDetails.couponCode,
          minimumPurachaseAmount: CouponDetails.minimumPurachaseAmount,
          discountAmount: CouponDetails.discountAmount,
          description: CouponDetails.description,
          validFrom: Starting,
          validTo: Ending,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  PatchCoupon: async (req, res) => {
    try {
      console.log("patch coupon is not working");
      console.log(req.body, "patchedit details");
      const offer = req.body.discountAmount;
      const actual = req.body.minimumPurachaseAmount;
      const offerPercentage = (offer / actual) * 100;

      const couponIN = await Coupon.findOne({
        couponCode: req.body.couponCode,
      });

      if (
        (req.body.couponCode == req.body.oldcouponCode && couponIN) ||
        (req.body.couponCode != req.body.oldcouponCode && !couponIN)
      ) {
        await Coupon.updateOne(
          { _id: req.body._id },
          {
            $set: {
              couponCode: req.body.couponCode,
              discountAmount: req.body.discountAmount,
              description: req.body.description,
              validFrom: req.body.validFrom,
              validTo: req.body.validTo,
              minimumPurachaseAmount: req.body.minimumPurachaseAmount,
              offerPercentage: offerPercentage,
            },
          }
        );
        res.json({ msg: "successfully" });
      } else {
        res.json({ msg: "this already exists" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  DeleteCoupon: async (req, res) => {
    try {
      console.log("this is working");
      console.log();

      const { CouponId } = req.params;

      await Coupon.deleteOne({ _id: CouponId });
      res.json({ msg: "Deleted Successfully" });
    } catch (err) {
      console.log(err);
    }
  },

  //going to user side the coupon

  GetUserCoupon: async (req, res) => {
    try {
      const Coupondetails = await Coupon.find();
      res.render("user/Usercoupon", { Coupondetails });
    } catch (err) {
      console.log(err);
    }
  },

  ApplyedCoupon: async (req, res) => {
    try {
      console.log(req.body);
      const { couponCode } = req.body;
      console.log(req.session.Grandamnt, "this grandtotal");
      const Grandtotal = req.session.Grandamnt;
      const date = new Date();

      if (req.session.couponCode) {
        const ApplyedCoupon = await Coupon.findOne({
          couponCode: req.session.Grandamnt,
        });
        if (ApplyedCoupon) {
          res.json({ errMsg: "this is alredy the " });
        }
      }

      const couponData = await Coupon.findOne({ couponCode: couponCode });

      //then check the date and grandtotal  conditons
      if (
        couponData != null &&
        date < couponData.validTo &&
        Grandtotal >= couponData.minimumPurachaseAmount
      ) {
        req.session.Grandamnt = Grandtotal - couponData.discountAmount;
        console.log(req.session.Grandamnt, "after decrese the discount amnt");
        (req.session.CouponCode = couponData.couponCode),
          (req.session.discountAmount = couponData.discountAmount),
          res.json({ msg: "Coupon Applied Successfuly" });
        console.log(req.session.CouponCode, "this coupon code ");
      } else {
        res.json({ errMsg: "Invalid coupon" });
      }
    } catch (err) {
      console.log(err);
    }
  },
  DeleteCoupon:async(req,res)=>{
    console.log(req.session.CouponCode,'This is the User Apply the current coupon');
    let RemoveCoupon =req.session.CouponCode
     const Grandtotal = req.session.Grandamnt;
    const CouponDetail = await Coupon.findOne({couponCode:RemoveCoupon})
    console.log(CouponDetail,'this is wanted to remove click user ');
    if(CouponDetail){
        req.session.Grandamnt = Grandtotal + CouponDetail.discountAmount;
        req.session.CouponCode=undefined
        req.session.discountAmount=undefined

        res.json({msg:'Remove The Coupon Successfully'})

    }else{
      res.json({msg:'This coupon is Not Valid'}) 
    }



  },
};
