const catagories = require("../models/catagoryModel");
const Brand = require("../models/brandModel");
const products = require("../models/productModel");

module.exports = {
  getaddcatagory: async (req, res) => {
    try {
      res.render("admin/addcatagory");
    } catch (err) {
      console.log("yes come up catagorycontroller 1", err);
    }
  },
  postaddcatagory: async (req, res) => {
    try {
      //  console.log(req.body.name)
      let cat = req.body.catagoryname;
      cat = cat.toUpperCase().trim();
      console.log(cat);
      const catdata = await catagories.findOne({ catagoryname: cat });
      let error = " ";
      if (catdata) {
        error = "this catagory already exists";
        res.render("admin/addcatagory", { err: error });
      } else {
        // const cat=req.body.catagoryname
        // const cat=catdata
        cat = cat.toUpperCase().trim();
        await catagories.create({ catagoryname: cat });
        const Categories = await catagories.find();
        res.redirect("/admin/catagory");
      }
    } catch (err) {
      console.log("yes come up catagorycontroller2", err);
    }
  },
  //eddit
  getEditcatagory: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await catagories.find({ _id: id });
      req.session.Erromsg=''

      if (data) {
        console.log("tusgjskdfsgjf", data[0]);
        res.render("admin/editcatagory", {
          catagories: data[0],
          err: req.session.Erromsg,
        });
      }
      //   console.log("error data");
    } catch (err) {
      console.log("come up editcatagory", err);
    }
  },
  postEditcatagory: async (req, res) => {
    try {
      console.log(req.body.id);

      let cat = req.body.catagoryname;
      cat = cat.toUpperCase().trim();
      console.log("cat-", cat);
      const data = await catagories.findOne({ catagoryname: cat });
      if (data) {
        const result = await catagories.find({ _id: req.body.id });
        console.log("this ", result);
       
        req.session.Erromsg='this catagory alredy taken '
        res.render("admin/editcatagory", {
         
          catagories: result[0],
          err: req.session.Erromsg,
        });
      } else {
        await catagories.updateOne(
          { _id: req.body.id },
          { $set: { catagoryname: cat } }
        );
        console.log(req.body.id);

        res.redirect("/admin/catagory");
      }
    } catch (err) {
      console.log("come up postEditcat", err);
    }
  },
  deleteCatagory: async (req, res) => {
    try {
      console.log(req.params.id);
      await catagories.deleteOne({ _id: req.params.id });
      res.json({ msg: "Catagory deleted successfuly" });
    } catch (err) {
      console.log("come up delete catagory", err);
    }
  },
  //---------------------------------------------------BRAND-----------------------------------------------------
  getAddBrand: async (req, res) => {
    try {
      res.render("admin/addbrand");
    } catch (err) {
      console.log("BRAND", err);
    }
  },
  postAddBrand: async (req, res) => {
    try {
      console.log("try", req.body.Brandname);
      let bran = req.body.Brandname;
      bran = bran.toUpperCase();
      const brandata = await Brand.findOne({ Brandname: bran });
      if (brandata) {
        res.render("admin/addbrand", { err: "this data already exists" });
      } else {
        console.log("tyr2", req.body.Brandname);
        let bran = req.body.Brandname;

        bran = bran.toUpperCase();
        console.log(bran);
        await Brand.create({ Brandname: bran });
        res.redirect("/admin/catagory");
      }
    } catch (err) {
      console.log("come up  BRAND-2", err);
    }
  },
  geteditbrand: async (req, res) => {
    try {
      console.log("id:", req.params.id);
      const id = req.params.id;
      const data = await Brand.find({ _id: id });
      if (data) {
        res.render("admin/editbrand", { Brands: data[0] });
      }
    } catch (err) {
      console.log("come up BRAND-3");
    }
  },
  postEditbrand: async (req, res) => {
    try {
      console.log(req.body.id);
      let bran = req.body.Brandname;
      bran = bran.toUpperCase().trim();
      const data = await Brand.findOne({ Brandname: bran });
      if (data) {
        let result = await Brand.findOne({ _id: req.body.id });
        res.render("admin/editbrand", {
          err: "this data already exists",
          Brands: result,
        });
      } else {
        await Brand.updateOne(
          { _id: req.body.id },
          { $set: { Brandname: bran } }
        );
        res.redirect("/admin/catagory");
      }
    } catch (err) {
      console.log("come up BRAND-4", err);
    }
  },

  Deletebrand: async (req, res) => {
    try {
      const id = req.params.id;
      await Brand.deleteOne({ _id: id });
      res.json({ msg: "Brand deleted successfully" });
    } catch (err) {
      console.log("come up Brand-4", err);
    }
  },
  ListandUnlist: async (req, res) => {
    try {
      console.log("Received params:", req.params);
      const { id, status } = req.params;
      const [SingleCat, catprdoduct] = await Promise.all([
        catagories.findOne({ _id: id }),
        products.find({ catagory: id }),
      ]);

      console.log("catpro", catprdoduct);

      console.log(SingleCat, "thsi is single cata");
      if (status === "active") {
        console.log("its working no tproblem");
        await catagories.updateOne(
          { _id: id },
          { $set: { status: "inactive" } }
        );

        await products.updateMany(
          { catagory: id },
          { $set: { status: "inactive" } }
        );

        res.json({ msg: "ok" });
      } else {
        await catagories.updateOne({ _id: id }, { $set: { status: "active" } });

        await products.updateMany(
          { catagory: id },
          { $set: { status: "active" } }
        );
        res.json({ msg: "double oke" });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
