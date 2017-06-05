$(document).ready(function() {

  $('#joinButton').click(function() {
    var user_id = $('#join_id').val();
    var password = $('#join_password').val();
    var data = {
      'id': user_id,
      'password': password
    }
    $.ajax({
      type: "POST",
      url: "/practice/join",

      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      data: data,
      success: function(result) {
        alert('가입 성공!');
        console.log(result);
        if (result.status == 200) {
          self.isEditMode(!self.isEditMode());
        }
      },
      error: function(error) {
        alert('가입 실패!');
      }
    }).complete(function() {
      $(window).attr('location','/practice');
    });
  });
});
