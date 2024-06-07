$(document).ready(function () {
    let product_id = 0;
    $(".deletelink").click(function (event) {
      product_id = event.target.id.substring(11);
      $("#successModal").modal('show');
    });
    $("#btnclose").click(function () {
      $("#successModal").modal('hide');
    });
    $("#btnSubmit").click(function () {
      window.location = '/products/delete/'+product_id;
      console.log('deleted');
    });
    
    $("#btnQR").click(function () {
      $("#qrModal").modal('show');
    });
    $("#btnQRclose").click(function () {
      $("#qrModal").modal('hide');
    });
    $("#btnQRSubmit").click(function () {
      if(!validateForm()) {
        const qtyInput = document.getElementById('txtqty');
        const pointInput = document.getElementById('txtpoints');
        const  selectElement = document.querySelector('#product');
        let selected_product_id = selectElement.value;
        window.location = '/products/bulkQR/' + selected_product_id + '/' + pointInput.value + '/' + qtyInput.value ;
      }
      // console.log('deleted');
    });
    
    
    function validateForm() {
    const qtyInput = document.getElementById('txtqty');
    const pointInput = document.getElementById('txtpoints');
    const  selectElement = document.querySelector('#product');
    let selected_product_id = selectElement.value;
    let flag = false;
    if (!qtyInput.value) {
      flag = true;
      event.preventDefault();
      qtyError.textContent = 'Please enter quantity.';
    } else {
      qtyError.textContent = '';
    }
    
    if (!pointInput.value) {
      flag = true;
      event.preventDefault();
      pointsError.textContent = 'Please enter reward points.';
    } else {
      pointsError.textContent = '';
    }

    if(selected_product_id == -1) {
      flag = true;
      event.preventDefault();
      productError.textContent = 'Please select product.';
    } else {
      productError.textContent = '';
    }

    return flag;
  }

  document.getElementById('btnQRSubmit').addEventListener('click', validateForm);
  });