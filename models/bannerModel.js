const mongoose = require("mongoose");
require("dotenv").config();

const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  bannerName: {
    type: String,
    required: true,
  },
  bannerImages: {
    type: String,
   
  },
});


const Banner = mongoose.model("Banner", BannerSchema, "bannerCollection");

module.exports = Banner 
