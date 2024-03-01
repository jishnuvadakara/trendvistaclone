//user address delete
function deleteAddress(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You will remove this address",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Handle the deletion action here
      $.ajax({
        url: "deleteAddress/" + `${id}`,
        method: "delete",
        success: function (response) {
          Swal.fire({
            text: response.msg,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: function (err) {
          Swal.fire({
            text: "Something wrong!",
            icon: "error",
            showConfirmButton: false,
          });
          console.log("Sweet-error", err);
        },
      });
    }
  });
}

//user add to cart toastify functionality
function addTocart(productid) {
  console.log("ajax is working");
  $.ajax({
    url: "/addTocart/" + `${productid}`,
    method: "get",
    success: function (response) {
      Toastify({
        text: response.msg,
        duration: 3000, // three second
        gravity: "top",
        position: "center",
        backgroundColor: "green",
        stopOnFocus: true,
      }).showToast();

      //set the time relod again and again
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    error: function (err) {
      Toastify({
        text: "Something happen ",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
        stopOnFocus: true,
      }).showToast();
      console.log("toastify error");
    },
  });
}

//-------------------------UPDATE THE CART QUANTITY----

function updateQuantity(count, prodId, qnt, crtId) {
  console.log("ajax is working ...");

  $.ajax({
    url: "/Updatequantity/" + `${count}/${prodId}/${qnt}/${crtId}`,
    method: "get",
    success: function (response) {
      Toastify({
        text: response.msg,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "blue",
        stopOnFocus: true,
      }).showToast();
      //set the time again reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    error: function (err) {
      Toastify({
        text: "Something wrong",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
        stopOnFocus: true,
      }).showToast();
      console.log("toastify error");
    },
  });
}

// remove the product in  user cart

function removecartprodct(crtprdctId) {
  console.log("ajax is working.....");

  Swal.fire({
    title: "Remove item",
    text: "Are you sure you want to remove this item?",
    icon: "warning",
    iconColor: "green", // Set the color here
    showCancelButton: true,
    showConfirmButton: "#DD6B55",
    showCancelButton: "#d33",
    confirmButtonText: "REMOVE",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/removecrtprdct/" + `${crtprdctId}`,
        method: "delete",
        success: function (response) {
          Toastify({
            text: response.msg,
            duration: 3000,
            gravity: "bottom",
            position: "center",
            backgroundColor: "green",
            stopOnFocus: true,
          }).showToast();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        error: function (err) {
          Toastify({
            text: "Something Happen ",
            duration: 3000,
            gravity: "bottom",
            position: "center",
            backgroundColor: "red",
            stopOnFocus: true,
          }).showToast();
          console.log("Toastify error");
        },
      });
    }
  });
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------

function addTowishlist(productid) {
  console.log("ajax is working");
  $.ajax({
    url: "/addTowishlist/" + `${productid}`,
    method: "get",
    success: function (res) {
      if (res.productExist == false && res.userExist == true) {
        console.log("hey come");
        Toastify({
          text: "Added to your Wishlist",
          gravity: "bottom",
          position: "center",
          backgroundColor: "green",
          stopOnFocus: true,
        }).showToast();
      } else if (res.productExist == true && res.userExist == true) {
        console.log("hey come2");
        Swal.fire({
          text: "This product already exists in Wishlist",
          icon: "info",
          iconColor: "blue",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
    error: function (err) {
      Toastify({
        text: "Something happen",
        gravity: "top",
        position: "center",
        backgroundColor: "red",
        stopOnFocus: true,
      }).showToast();

      console.log("Toastify error ");
    },
  });
}

function removeFromWish(productid) {
  console.log("ajx function is working");
  Swal.fire({
    text: "Are you sure you want to remove this product",
    icon: "warning",
    showCancelButton: true,
    showConfirmButton: true,
    showCancelButton: "#d33",
    showConfirmButton: "#DD6B55",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/removeFromWishlist/" + `${productid}`,
        method: "delete",
        success: function (response) {
          Swal.fire({
            text: response.msg,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: function (err) {
          Toastify({
            text: "Something happen",
            gravity: "top",
            position: "center",
            backgroundColor: "red",
            stopOnFocus: true,
          }).showToast();
        },
      });
      console.log("Toastify error");
    }
  });
}

// User order controlling and check out page ajaxt cotrolleer

function selectAddress(addressId) {
  console.log("Ajax is working ");
  $.ajax({
    url: "/confirmadressmsg/" + `${addressId}`,
    method: "get",
    success: function (response) {
      Toastify({
        text: response.msg,
        duration: 3000,
        gravity: "center",
        position: "right",
        backgroundColor: "green",
        stopOnFocus: true,
      }).showToast();
    },
    error: function (err) {
      Toastify({
        text: "Someting happen",
        duration: "3000",
        position: "center",
        backgroundColor: "red",
        stopOnFocus: true,
      }).showToast();
      console.log("Toastify error");
    },
  });
}

//confirm oderpage pass the type

//Canceld Single produdcts In user side
function cancelSingleProduct(OrderId, index) {
  console.log("ajax is working no problem prblem with your logic");

  Swal.fire({
    title: "Remove this Order!",
    text: "Are your sure",
    icon: "warning",
    showCancelButton: true,
    showConfirmButton: "DD6B55",
    showCancelButton: "#d33",

    confirmButtonText: " Remove",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/CancelSingleorder/" + `${OrderId}/${index}`,
        method: "delete",
        success: function (response) {
          Toastify({
            text: response.msg,
            duration: 3000,
            gravity: "center",
            position: "center",
            backgroundColor: "green",

            stopOnFocus: true,
          }).showToast();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        error: function (err) {
          Toastify({
            text: "Something problem",
            duration: 3000,
            gravity: "center",
            position: "center",
            backgroundColor: "red",
            stopOnFocus: true,
          }).showToast();
          console.log("toastify error ");
        },
      });
    }
  });
}

function confirmOrder(type) {
  console.log("confirmpassword Ajax");

  $.ajax({
    url: "/confirmorderMethod/" + `${type}`,
    method: "get",
    success: function (response) {
      Toastify({
        text: response.msg,
        duration: 3000,
        gravity: "center",
        position: "center",
        backgroundColor: "blue",
        stopOnFocus: true,
      }).showToast();

      if (response.payment == "COD") {
        window.location.href = "/PayementSuccesspage";
      } else if (response.payment == "online") {
        console.log("payment method is worked");

        console.log("Before CreateRazorpayOrder");
        console.log(response.order);

        createRazorpay(response.order);

        console.log("After CreateRazorpayOrder");
      }
    },
    error: function (err) {
      Toastify({
        text: "Something Happen",
        duration: 3000,
        gravity: "center",
        position: "center",
        backgroundColor: "black",
        stopOnFocus: true,
      }).showToast();
      console.log("Toastify error ");
    },
  });
}

//Create Razorpay
function createRazorpay(order) {
  const id = order.id;
  const total = order.amount;
  console.log("working  id and total:", id, total);

  var options = {
    key: "rzp_test_zA5XiwMTHLQIPm",
    amount: total,
    currency: "INR",
    name: "Trend-Vista",
    description: "Test Transaction",
    image: "",
    order_id: id,
    handler: function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      VerifyPayment(response, order);
    },
    theme: {
      color: "#3c3c3c",
    },
  };
  var razorpay = new Razorpay(options);
  razorpay.open();
}

//verify the Razorpay
function VerifyPayment(payment, order) {
  console.log("Verify the Razorpay :", payment, order);

  $.ajax({
    url: "/VerifyRazorpay",
    method: "post",
    data: { payment, order },
    success: function (response) {
      if (response.success) {
        location.href = "/PayementSuccesspage";
      }
    },
    error: function (err) {
      alert("Somehing Problem ..........");
    },
  });
}

// function ReturnOrder(){
//   console.log("Ajax is working ");

//   var formData = {
//     OrderId: document.getElementById("Orderid").value,
//     productId: document.getElementById("prodcutid").value,
//     userId: document.getElementById("userId").value,
//     reason: document.querySelector('input[name="reason"]:checked').value,
//     Description: document.getElementById("Description").value,
//   };

//   $.ajax({
//     url:"/RetrunOrder",
//     method:"post",
//     success:function(response){
//       Toastify({
//         text:response.msg,
//         duration:3000,
//         gravity:"center",
//         position:"center",
//         backgroundColor:"green",
//         stopOnFocus:true,

//       }).showToast()
//     },
//     error:function(err){
//       Toastify({
//         text:"Something Problem",
//         duration:3000,
//         gravity:"center",
//         position:"center",
//         backgroundColor:"red",
//         stopOnFocus:true
//       }).showToast()
//       console.log("somethin problem in your Toastify...............");
//     }
//   })
// }

//coupon controller hanlde the usercoupon
function ApplyFormCoupon() {
  console.log("working properly");
  var couponCode = document.getElementById("couponCode").value;
  $.ajax({
    url: "/applyCoupon",
    method: "post",
    data: { couponCode: couponCode }, // Send coupon code as data
    success: function (response) {
      if (response.msg) {
        Swal.fire({
          icon: "success",
          title: "Coupon applied",
          text: response.msg,
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (response.errMsg) {
        Swal.fire({
          icon: "error",
          title: "Coupon not applied",
          text: response.errMsg, // Change response.msg to response.errMsg
          showConfirmButton: false,
          timer: 3000,
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    error: function (err) {
      Toastify({
        text: "Something went wrong",
        duration: 3000,
        gravity: "center",
        position: "center",
        stopOnFocus: true,
      }).showToast();
    },
  });
}

//Refference for the user
function refference() {
  console.log("wokign properly");
  const email = document.getElementById("email").value;
  const userId = document.getElementById("userId").value;
  console.log("this ", email, userId);
  $.ajax({
    url: "/RefferenceApply",
    method: "post",
    data: { email: email, userId: userId },
    success: function (response) {
      Swal.fire({
        icon: "success",
        title: "Refference applied",
        text: response.msg,
        showConfirmButton: false,
        timer: 3000,
      });
    },
    error: function (err) {
      Toastify({
        text: "Something happen",
        duration: 3000,
        gravity: "center",
        position: "center",
        backgroundColor: "red",
        stopOnFocus: true,
      }).showToast();
    },
  });
}

//again payment for failed online payments
function AgainPayement(OrderId) {
  console.log("it wroking this is for OrderId:", OrderId);
  $.ajax({
    url: "/RazorpayFaledOrder/" + `${OrderId}`,
    method: "get",
    success: function (response) {
      Toastify({
        text: response.msg,
        duration: 3000,
        gravity: "center",
        position: "center",
        backgroundColor: "blue",
        stopOnFocus: true,
      }).showToast();
      if (response.payment == "online") {
        console.log("its working no problem");
        createRazorpay(response.order);
      }
    },
  });
}
