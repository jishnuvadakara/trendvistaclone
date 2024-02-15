const User = require("../models/userModel");
const Address = require("../models/addressModel");

module.exports = {
  postAddress: async (req, res) => {
    try {
      const [userData, user] = await Promise.all([
        User.findOne({ email: req.session.email }),
        User.findOne({ email: req.session.email }),
      ]);
      let userID = user._id;
      req.body.userId = userID;
      const userAdd = await Address.find({ userId: userID });

      if (User) {
        const msg = "Add Address successfuly";
        await Address.create(req.body);
        res.redirect("/userprofile");
      } else {
        const msg = "Sorry Something Error";
        res.redirect("/userprofile");
      }
    } catch (err) {
      console.log(err);
    }
  },
  //---------EditAddress--------
  EditAddress: async (req, res) => {
    try {
      // console.log(req.body);
      const Newaddress = req.body;
      console.log(Newaddress);
      const add_Id = Newaddress.id;
      const userID = Newaddress.userId;
      // console.log(userID);
      console.log("body", add_Id);

      const userData = await User.find({ email: req.session.email });
      //  console.log(userData);
      let ID = userData._id;

      const userAdd = await Address.find({ userId: ID });
      //  console.log(userID);

      if (userID != "") {
        await Address.updateOne(
          { _id: add_Id },
          {
            $set: {
              name: Newaddress.name,
              address: Newaddress.address,
              locality: Newaddress.locality,
              city: Newaddress.city,
              district: Newaddress.district,
              state: Newaddress.state,
              mobile: Newaddress.mobile,
              pincode: Newaddress.pincode,
              addrestype: Newaddress.addrestype,
            },
          }
        );
        const msg = "Edited successfuly";
        res.redirect("/userprofile");
      } else {
        const msg = "Something error please try again ";
        res.redirect("/userprofile");
      }
    } catch (err) {
      console.log(err);
    }
  },
  DeleteAdress: async (req, res) => {
    try {
      const deletedId = req.params.id;

      await Address.deleteOne({ _id: deletedId });
      res.json({ msg: "Adress deleted successfuly" });
    } catch (err) {
      console.log("userAddressDelete", err);
    }
  },
  Renameuser: async (req, res) => {
    try {
      const { username } = req.body;
      console.log(username);
      await User.updateOne(
        { _id: req.session.user_Id },
        { $set: { name: username } }
      );
      res.redirect("/userprofile");
    } catch (err) {
      console.log(err);
    }
  },

  postAddrsCheckout: async (req, res) => {
    try {
      const Uerdata = await User.findOne({ email: req.session.email });

      if (Uerdata) {
        console.log("its woring ...", req.body);

        // Now 'editAddressType' should contain either "Home" or "Work" based on the selected radio button.

        // Rest of your logic to save/update the address...
        req.body.userId=req.session.user_Id

        await Address.create(req.body);

        res.redirect("/checkoutpage");
      } else {
        console.log("no user something happen ");

        res.redirect("/userhome");
      }
    } catch (err) {
      console.log("mistake in checkout page address", err);
    }
  },
};
