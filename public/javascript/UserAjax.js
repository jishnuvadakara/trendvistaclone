

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
      }, 3000);
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
            window.location.reload()
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
