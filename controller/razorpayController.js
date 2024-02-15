
// Import Razorpay library before using it
// const Razorpay = require("razorpay");

// Rest of your code

// require('dotenv').config()

//this razorpay keys...............................
// const instance = new Razorpay({
//   key_id: process.env.RazorpayKey_id,
//   key_secret: process.env.RazorpayKey_secret,
// });

// console.log("Razorpay instance variable in env files:", instance);
// create razorpay account

// const CreateRazorpayOrder = (res, orderId, total) => {
//   try {
//     var options = {
//       amount: total,
//       currency: "INR",
//       receipt: orderId,
//     };

    //create instance
//     console.log("new options:", options);

//     instance.orders.create(options, function (err, order) {
//       console.log("new ordercreate:",order);
//       if (err) {
//         console.log("Error create order:", err);
//         res.status(500).send("Somethig problem in Developer code ");
//       } else {
//         console.log("New order", order);
//         console.log("its not problem everything ok ");

//         res.json({ order: order, payment: "online" });
//       }
//     });
//   } catch (err) {
//     console.log("Something problem in your razorpay controller", err);
//     res.status(500).send("Something Create Order in Razorpay");
//   }
// };

// module.exports = { CreateRazorpayOrder };
// Add this line at the top to ensure the environment variables are loaded
require('dotenv').config();

const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RazorpayKey_id,
  key_secret: process.env.RazorpayKey_secret,
});

const CreateRazorpayOrder = (res, orderId, total) => {
  try {
    var options = {
      amount: total*100,
      currency: "INR",
      receipt: orderId,
    };

    console.log("New options:", options);

    instance.orders.create(options, function (err, order) {
      console.log("New order create:", order);
      if (err) {
        console.error("Error creating order:", err);
        res.status(500).send("Something went wrong on the server");
      } else {
        console.log("New order", order);
        res.json({ order: order, payment: "online" });
      }
    });
  } catch (err) {
    console.error("Error in Razorpay controller:", err);
    res.status(500).send("Something went wrong on the server");
  }
};

module.exports = { CreateRazorpayOrder };

