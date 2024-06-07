$(document).ready(function () {
    let category_id = 0;
    $(".deletelink").click(function (event) {
      category_id = event.target.id.substring(11);
      $("#successModal").modal('show');
    });
    $("#btnclose").click(function () {
      $("#successModal").modal('hide');
    });
    $("#btnSubmit").click(function () {
      window.location = '/categories/delete/'+category_id;
      console.log('deleted');
    });
  });