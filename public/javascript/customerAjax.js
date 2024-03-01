const { name } = require("ejs");

function block(id, status) {
  console.log("ajax", id, status);

  $.ajax({
    url: "/admin/updateuser/" + `${id}/${status}`,
    method: "get",
    // data:{id:id,status:status},
    success: function (response) {
      window.location.reload();
      alert(response.msg);
    },
    error: function (err) {
      alert("something error in your college");
    },
  });
}

// Catagory remove
function remove(id, name) {
  console.log("ajax", id, name);
  let resutl = confirm("Are you sure");
  if (resutl == true) {
    $.ajax({
      url: "/admin/catagory/" + `${id}/${name}`,
      method: "get",
      success: function (response) {
        window.location.reload();
        alert(response.msg);
      },
      error: function (err) {
        alert("something error");
      },
    });
  }
}
//Brand remove
function removeBrand(id, name) {
  console.log("ajax", id, name);
  let result = confirm("Are you sure..");
  if (result == true) {
    $.ajax({
      url: "/admin/deletbrand/" + `${id}/${name}`,
      method: "get",
      success: function (response) {
        window.location.reload();
        alert(response.msg);
      },
      error: function (err) {
        alert("something error");
      },
    });
  }
}
// --------------PRODUCTS-------------------------------------------------------------------------------------------------------------------------
function Block(id, status) {
  console.log("ajax", id, status);
  $.ajax({
    url: "/admin/updateProduct/" + `${id}/${status}`,
    method: "get",
    success: function (response) {
      window.location.reload();
      alert(response.msg);
    },
    error: function (err) {
      alert("Something wrong ");
    },
  });
}
function removeProduct(id, productName) {
  console.log("ajax", id, productName);
  let data = confirm("Are you sure.");
  if (data == true) {
    $.ajax({
      url: "/admin/deleteProduct/" + `${id}/${productName}`,
      method: "get",
      success: function (response) {
        window.location.reload();
        alert(response.msg);
      },
      error: function (err) {
        alert("Something problem");
      },
    });
  }
}

function removeimg(images, id) {
  console.log("working ajax");
  console.log(images, id);
  let result = confirm("Admin are you sure..");
  if (result == true) {
    $.ajax({
      url: "/admin/DeleteImages/" + `${images}/${id}`,
      method: "get",
      success: function (response) {
        window.location.reload();
        alert(response.msg);
      },
      error: function (err) {
        alert("Something problem");
      },
    });
  }
}

//--------------------------------
function updateOrderStatus(OrderId, status) {
  console.log("Ajax is working ");
  console.log("status", status);
  Swal.fire({
    title: "Are you sure?",
    text: "change this orderstatus",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "updateOrderstartus/" + `${OrderId}/${status}`,
        method: "put",
        success: function (response) {
          Toastify({
            text: response.msg,
            duration: 3000,
            gravity: "top",
            postion: "center",
            backgroundColor: "green",
            stopOnFocus: true,
          }).showToast();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: function (err) {
          Toastify({
            text: "Something Happen",
            duration: 3000,
            gravity: "top",
            postion: "center",
            backgroundColor: "red",
            stopOnFocus: true,
          }).showToast();
        },
      });
    }
  });
}

//AddCoupon is here
function AddCoupon() {
  console.log("it working ");

  // Retrieve values from form elements
  const CouponCode = document.getElementById("CouponCode").value;
  const Minimumamnt = document.getElementById("Minimumamnt").value;
  const discountamnt = document.getElementById("discountamnt").value;
  const description = document.getElementById("description").value;
  const StratingDate = document.getElementById("startingdate").value;
  const EndDate = document.getElementById("endingdate").value;
  console.log(CouponCode, "code", Minimumamnt, "amoutn");
  console.log(
    StratingDate,
    "this for Starting date",
    EndDate,
    "this is ending date"
  );

  // Send Ajax request
  $.ajax({
    url: "/Admin/AddCoupon",
    method: "POST",
    data: {
      couponCode: CouponCode,
      minimumPurachaseAmount: Minimumamnt,
      discountAmount: discountamnt,
      description: description,
      validFrom: StratingDate,
      validTo: EndDate,
    },
    success: function (response) {
      Toastify({
        text: response.msg,
        duration: 3000,
        gravity: "center",
        postion: "center",
        backgroundColor: "green",
        stopOnFocus: true,
      }).showToast();

      $("#exampleModal").modal("hide");

      document.getElementById("Addcoupon").reset();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    error: function (xhr, status, error) {
      // Handle errors
      Toastify({
        text: "Something Happen",
        duration: 3000,
        gravity: "center",
        postion: "center",
        backgroundColor: "red",
        stopOnFocus: true,
      }).showToast();
    },
  });
}

function DeleteCoupon(CouponId) {
  console.log("its working");
  console.log("this is coupon id", CouponId);
  Swal.fire({
    title: "Are you sure!",
    text: "Delte the coupon",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/admin/Deletecoupon/" + `${CouponId}`,
        method: "DELETE",
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
            text: "Something Problem",
            duration: 3000,
            gravity: "center",
            position: "center",
            backgroundColor: "red",
            stopOnFocus: true,
          }).showToast();
        },
      });
    }
  });
}

// editcoupon
function EditCoupon(CouponId) {
  console.log("its working ");
  $.ajax({
    url: "/admin/EditCoupon/" + `${CouponId}`,
    method: "get",
    success: function (response) {
      $("#CouponId").val(response.CouponId);
      $("#couponCode").val(response.couponCode),
        $("#oldcouponCode").val(response.couponCode),
        $("#minimumPurachaseAmount").val(response.minimumPurachaseAmount),
        $("#discountAmount").val(response.discountAmount),
        $("#description").val(response.description),
        $("#validFrom").val(response.validFrom),
        $("#validTo").val(response.validTo),
        $("#exampleEditModal").modal("show");
    },
    error: function (err) {
      Toastify({
        text: "Something Problem",
        duration: 3000,
        gravity: "center",
        postion: "center",
        backgroundColor: "red",
        stopOnFocus: true,
      }).showToast();
    },
  });
}

function PostEditCoupon() {
  var formData = {
    _id: $("#CouponId").val(),
    couponCode: $("#couponCode").val(),
    oldcouponCode: $("#oldcouponCode").val(),
    minimumPurachaseAmount: $("#minimumPurachaseAmount").val(),
    discountAmount: $("#discountAmount").val(),
    description: $("#description").val(),
    validFrom: $("#validFrom").val(),
    validTo: $("#validTo").val(),
  };

  $("#exampleEditModal").modal("hide");

  $.ajax({
    type: "PATCH",
    url: "/admin/PatchCoupon",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      Toastify({
        text: response.msg,
        duration: 3000,
        gravity: "center",
        position: "center",
        backgroundColor: "green",
        stopOnFocus: true,
      }).showToast();
      // console.log("Data submitted successfully");
      // console.log(response);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    error: function (xhr, status, error) {
      Swal.fire("Something went wrong");
      console.error("Error submitting data:", error);
    },
  });
}

//Rtrun accept in function
function submitReturnResponse(PrdId, orderId, status, userId, index) {
  console.log(
    "this is working properly",
    PrdId,
    orderId,
    status,
    userId,
    index
  );
  $.ajax({
    url: "/admin/ReturnAccept",
    method: "post",
    data: {
      PrdId: PrdId, // Corrected parameter name
      orderId: orderId,
      status: status,
      userId: userId,
      index: index,
    },
    success: function (response) {
      // You may consider removing the page reload
      window.location.reload();
      alert(response.msg);
    },
    error: function (err) {
      alert("Something went wrong");
      console.log(err);
    },
  });
}


//Catagory list and Unlist 
function catagoryBlock(catagroyId, status) {
  console.log("its is working ");
 
      $.ajax({
        url: "/admin/ListandUnlistCat/" + `${catagroyId}/${status}`,
        method: "get",
        success: function (response) {
          Toastify({
            text: response.msg,
            duration: 3000,
            gravity: "center",
            position: "center",
            backgroundColor: "green",
            stopOnFocus: true,
          }).showToast();
        },
        error: function (err) {
          Toastify({
            text: "Something happened",
            duration: 3000,
            gravity: "center",
            position: "center",
            backgroundColor: "green",
            stopOnFocus: true,
          }).showToast();
        },
      });
 
}

