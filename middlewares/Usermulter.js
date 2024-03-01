const multer = require("multer");
const path = require("path");

// handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("hiiiii");
    cb(null, "public/User-images/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
