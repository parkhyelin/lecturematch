$(document).ready(function() {

  $('#leaveButton').click(function() {
    var password = $('#leave_password').val();
    var data = {
      'password': password
    }
    $.ajax({
      type: "POST",
      url: "/practice/userleave",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      data: data,
      success: function(result) {
        alert('탈퇴 성공!');
        console.log(result);
        if (result.status == 200) {
          self.isEditMode(!self.isEditMode());
        }
      },
      error: function(error) {
        alert('탈퇴 실패!');
      }
    }).complete(function() {
      $(window).attr('location','/practice');
    });
  });
});
