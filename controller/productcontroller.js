const products = require("../models/productModel");
const catagory = require("../models/catagoryModel");
const Brand = require("../models/brandModel");
const sharp = require("sharp");

module.exports = {
  getAddproduct: async (req, res) => {
    try {
      const [catagories, Brands] = await Promise.all([
        catagory.find(),
        Brand.find(),
      ]);
      res.render("Admin/addproduct", { catagories, Brands });
    } catch (err) {
      console.log("come up productcontroller-1", err);
    }
  },
  // postAddproduct: async (req, res) => {
  //   console.log("ajax reached");
  //   try {
  //     if (req.fileValidationError) {
  //       return res.status(400).json({ error: req.fileValidationError });
  //     } else if (!req.files) {
  //       return res.status(400).json({ error: "No files uploaded" });
  //     }

  //     console.log(req.files, req.body,'this is this ');
  //     const productdetails = req.body;
  //     let files = req?.files;
  //     console.log(files);
  //     let images = [
  //       files.images1[0].filename,
  //       files.images2[0].filename,
  //       files.images3[0].filename,
  //       files.images4[0].filename,
  //     ];

  //     const uploaddeatils = {
  //       ...productdetails,
  //       images,
  //     };
  //     console.log("🚀 ~ file: productcontroller.js:39 ~ postAddproduct: ~ uploaddeatils:", uploaddeatils)
  //     // await products.create(uploaddeatils);

  //     // res.json({ msg: "oke" });
  //     res.redirect("/admin/product");
  //   } catch (err) {
  //     console.log("come up productcontroller-2", err);
  //   }
  // },
  postAddproduct: async (req, res) => {
    console.log("AJAX request reached");

    try {
      if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
      } else if (!req.files || !req.body) {
        return res
          .status(400)
          .json({ error: "No files or form data uploaded" });
      }

      console.log(req.files, req.body);

      const productdetails = req.body;
      console.log("🚀 ~ file: productcontroller.js:66 ~ postAddproduct: ~ productdetails:", productdetails)
      const files = req.files;
      console.log("🚀 ~ file: productcontroller.js:68 ~ postAddproduct: ~ files:", files)

      //? Extract filenames from uploaded images
      const images = [
        files.images1[0].filename,
        files.images2[0].filename,
        files.images3[0].filename,
        files.images4[0].filename,
      ];

      const uploaddeatils = { ...productdetails, images };
      
      await products.create(uploaddeatils);
      res.json({msg:'ADD'})
      //*Image croping done 
     
      
    } catch (err) {
      console.log("Error occurred:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  Updateproduct: async (req, res) => {
    try {
      console.log(
        "Updateproducts..................................................................................."
      );
      const id = req.params.id; //prodid
      const status = req.params.status;
      console.log(status);
      const data = await products.findOne({ _id: id });
      var msg;
      if (data.status == "active") {
        await products.updateOne({ _id: id }, { $set: { status: "block" } });
        msg = "block";
      } else {
        await products.updateOne({ _id: id }, { $set: { status: "active" } });
        msg = "Ublock";
        res.json({ msg: `${msg} Successfuly` });
      }
    } catch (err) {
      console.log("Come up prodcuctcontroller-3", err);
    }
  },
  Deleteproduct: async (req, res) => {
    try {
      console.log(req.params.id);
      const id = req.params.id;
      await products.deleteOne({ _id: id });
      res.json({ msg: "successfuly deleted" });
    } catch (err) {
      console.log("come up productcntroller-4", err);
    }
  },
  getEditproduct: async (req, res) => {
    try {
      const id = req.params.id;
      const [product, catagories, Brands] = await Promise.all([
        products.find({ _id: id }),
        catagory.find(),
        Brand.find(),
      ]);
      res.render("Admin/editproduct", {
        product: product[0],
        catagories,
        Brands,
      });
    } catch (err) {
      console.log("come up productcontroller-5", err);
    }
  },
  postEditproduct: async (req, res) => {
    try {
      let id = req.params.id;
      prodtImg = await products.findOne({ _id: id });
      console.log(req.files);

      let img = [];
      if (prodtImg) {
        img.push(...prodtImg.images);
      }

      //---------------image edit---------
      for (let i = 0; i < 5; i++) {
        if (req.files[i]) {
          let position = req.files[i].fieldname.split("");
          console.log(position.length);
          console.log("images", position);
          img[position[6] - 1] = req.files[i].filename;
        }
      }
      let prodecd = req.body;
      console.log("this any error", req.body, "this is edit products ");
      prodecd.images = img;
      //   prodecd.status="Active"
      console.log(prodecd, "is any mistake ");
      console.log("this is image ", prodecd.images);

      let data = await products.updateOne(
        { _id: id },
        { $set: { ...prodecd } }
      );
      if (data) {
        res.redirect("/admin/product");
      }
    } catch (err) {
      console.log("Come up productcontroll-6", err);
    }
  },
  DeleteImages: async (req, res) => {
    try {
      const id = req.params.id;
      const name = req.params.imgname;
      console.log(name);

      await products.updateOne({ _id: id }, { $pull: { images: name } });
      res.redirect("/admin/product");
    } catch (err) {
      console.log("come up deleteproduct", err);
    }
  },

  //---------------------------------LIST the Product in user side ----------------------------

  //------------------Single Productss------------------
  // ProductDetail:async(req,res)=>{
  //     try{
  //         const id= req.params.id
  //         const prdt=await products.findOne({_id:id})
  //         res.render('user/productsDetails',{data:prdt[0]})

  //     }catch(err){
  //         console.log("come up user side productcontroller-2",err)

  //     }
  // }
};
