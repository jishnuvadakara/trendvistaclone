const express = require("express");
const router = express.Router();
const adminhelper = require("../controller/admin-helper");
const admincontroller = require("../controller/admincontroller");
const middleman = require("../middlewares/session");
const catagorycontroller = require("../controller/catagorycontroller");
const productcontroller = require("../controller/productcontroller");
const dashboardController = require("../controller/dashboardController");
const couponController = require("../controller/couponController");
const Upload = require("../middlewares/multer");
const bUpload = require("../middlewares/bannermulter");

//--------Login----------------------------------------------------------------------------------------------------------------------------
router.get("/", adminhelper.getadminlog);
router.post("/adminlogin", adminhelper.postadminlog);
// router.get('/adminDashboard',adminhelper.postadminlog)

//------------------------------Dashboard--------------------------------------------------------------
router.get("/dashboard",middleman.verifyAdmin, dashboardController.GetDashboard);
// controlling the chart
router.get("/count-orders-by-day", middleman.verifyAdmin,dashboardController.getCount);
router.get("/count-orders-by-month",middleman.verifyAdmin, dashboardController.getCount);
router.get("/count-orders-by-year", middleman.verifyAdmin,dashboardController.getCount);
//--Salesreport---
router.post("/Salesreport", dashboardController.Salesrepot);

//------------------------------/Dashboard/--------------------------------------------------------------

//***********************Controlling***********************************************************************************
//---------------------------------------------------------Customers----------------------------------------------------------
router.get("/userlist", middleman.verifyAdmin, admincontroller.getCustomer)
router.get(
  "/updateuser/:id/:status",
  middleman.verifyAdmin,
  admincontroller.updateUser
);
//---Search---
router.post("/search", admincontroller.SearchUser)

//----------------Catagory------------------------------------------------
router.get("/catagory", middleman.verifyAdmin, admincontroller.getCatagory);
//--------ADD--
router.get(
  "/addcatagory",
  middleman.verifyAdmin,
  catagorycontroller.getaddcatagory
);
router.post(
  "/addcatagory",
  middleman.verifyAdmin,
  catagorycontroller.postaddcatagory
);
//---Edit--------
router.get(
  "/editcatagoryes/:id",
  middleman.verifyAdmin,
  catagorycontroller.getEditcatagory
);
router.post(
  "/editcatagory",
  middleman.verifyAdmin,
  catagorycontroller.postEditcatagory
);
router.get(
  "/catagory/:id/:name",
  middleman.verifyAdmin,
  catagorycontroller.deleteCatagory
)

router.get(
  "/ListandUnlistCat/:id/:status",
  catagorycontroller.ListandUnlist
)

//------------------------------BRAND----------------------------------------------------------------------------------------
router.get("/addbrand", middleman.verifyAdmin, catagorycontroller.getAddBrand);
router.post(
  "/addbrand",
  middleman.verifyAdmin,
  catagorycontroller.postAddBrand
);
router.get(
  "/editbrand/:id",
  middleman.verifyAdmin,
  catagorycontroller.geteditbrand
);
router.post(
  "/editbrand",
  middleman.verifyAdmin,
  catagorycontroller.postEditbrand
);
router.get(
  "/deletbrand/:id/:name",
  middleman.verifyAdmin,
  catagorycontroller.Deletebrand
);

//--------------------------------Product-----------------------------------------------------------
const Fields = [
  { name: "images1", maxCount: 1 },
  { name: "images2", maxCount: 1 },
  { name: "images3", maxCount: 1 },
  { name: "images4", maxCount: 1 },
];

router.get("/product", middleman.verifyAdmin, admincontroller.getProduct);
//----ADDP--
router.get(
  "/addproducts",
  middleman.verifyAdmin,
  productcontroller.getAddproduct
);
router.post(
  "/addproducts",
  Upload.fields(Fields),
  productcontroller.postAddproduct
);
//--BlockP
router.get(
  "/updateProduct/:id/:status",
  middleman.verifyAdmin,
  productcontroller.Updateproduct
);
//--DELETEP--
router.get(
  "/deleteProduct/:id/:productName",
  middleman.verifyAdmin,
  productcontroller.Deleteproduct
);
//--Edit--
router.get(
  "/editproduct/:id",
  middleman.verifyAdmin,
  productcontroller.getEditproduct
);
router.post(
  "/editproduct/:id",
  Upload.any(),
  productcontroller.postEditproduct
);
router.get("/DeleteImages/:imgname/:id", productcontroller.DeleteImages);

//----------------------------------------------------------------------------------ORders------------------------------
router.get(
  "/GetOrderinadmin",
  middleman.verifyAdmin,
  admincontroller.GetAdminOrders
);

router.put(
  "/updateOrderstartus/:OrderId/:status",
  middleman.verifyAdmin,
  admincontroller.ChangeOrderStatus
);

router.get(
  "/OrderDetails/:id",
  middleman.verifyAdmin,
  admincontroller.Orderlist
);

router.post("/ReturnAccept", admincontroller.ReturnAccept);

//-------------------------------------------------------------------------------------------------Coupon-------------------------------------------
router.get("/CouponAdmin", couponController.GetCoupon);
router.post("/AddCoupon", couponController.PostAddCoupon);

router.get("/EditCoupon/:CouponId", couponController.GetEditCoupon);
router.patch("/PatchCoupon", couponController.PatchCoupon);

router.delete("/Deletecoupon/:CouponId", couponController.DeleteCoupon);

//-----------------------------------------------------------------------------Banner---UI--------------------------------------------------------------------
// const BannerIM = [{ name: "banner", maxCount: 1 }];
const uploadbanner = [{ name: "banner", maxCount: 1 }];
router.get('/BannerUI',middleman.verifyAdmin,admincontroller.GetBanner)
router.get('/AddBanner',middleman.verifyAdmin,admincontroller.AddBanner)
router.post("/addbanner", bUpload.fields(uploadbanner), admincontroller.PostAddBanner);

//----------ADMIN LOGOUT------------------------------------------------------
router.get("/signout", adminhelper.addlogout);
module.exports = router;
