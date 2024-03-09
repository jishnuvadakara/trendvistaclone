const catagories = require("../models/catagoryModel");
const Brand = require("../models/brandModel");
const products = require("../models/productModel");

module.exports = {
  getaddcatagory: async (req, res) => {
    try {
      res.render("Admin/addcatagory");
    } catch (err) {
      console.log("yes come up catagorycontroller 1", err);
    }
  },
  postaddcatagory: async (req, res) => {
    try {
      let cat = req.body.categoryname;
      console.log(req.body, "koko");
      console.log(cat, "kokok");

      if (cat) {
        // Check if cat is not undefined or null
        cat = cat.toUpperCase();
        console.log(cat, "looo");
        const catdata = await catagories.findOne({ catagoryname: cat });
        let error = "";

        if (catdata) {
          error = "This category already exists";
          res.render("Admin/addcatagory", { err: error });
        } else {
          await catagories.create({ catagoryname: cat });
          // const Categories = await catagories.find();
          res.redirect("/admin/catagory");
        }
      } else {
        // Handle the case where cat is undefined or null
        console.log("Category name is not provided");
        res.status(400).send("Category name is required");
      }
    } catch (err) {
      console.log("Error in postaddcatagory:", err);
      res.status(500).send("Internal Server Error");
    }
  },

  //eddit
  getEditcatagory: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await catagories.find({ _id: id });

      if (data) {
        console.log("tusgjskdfsgjf", data[0]);
        res.render("Admin/editcatagory", {
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
      // req.session.Erromsg=''

      let cat = req.body.catagoryname;
      // if(cat.)
      cat = cat.toUpperCase().trim();
      if (cat == "") {
        console.log("hey");
      } else if (/\d/.test(cat)) {
        console.log("number");
      } else {
        console.log("ok");
      }

      console.log("cat-", cat);
      const data = await catagories.findOne({ catagoryname: cat });
      if (data || cat == "" || /\d/.test(cat)) {
        const result = await catagories.find({ _id: req.body.id });
        console.log("this ", result);
        req.session.Erromsg =
          "this catagory alredy taken || check enter the value string  ";

        console.log("yes wroking");
        //  res.redirect("/admin/catagory");
        // res.redirect("/admin/editcatagoryes");
        res.render("Admin/editcatagory", {
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
      res.render("Admin/addbrand");
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
        res.render("Admin/addbrand", { err: "this data already exists" });
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
        res.render("Admin/editbrand", { Brands: data[0] });
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
        res.render("Admin/editbrand", {
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
