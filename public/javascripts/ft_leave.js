$(document).ready(function() {

  $('#ok_button').click(function() {
    $(window).attr('location','/first_test/main/1');
  });

  $('#rectangle_8_1').click(function(){
    $(window).attr('location','/first_test/mypage');
  });

    $('#rectangle_8_2').click(function() {
      var user_password= $('.a1').val();
      if(user_password ==''){
        alert("비밀번호를 입력하세요.");
      }else{
      var data = {
        'password': user_password
      }
      $.ajax({
        type: "post",
        url: "/first_test/leave1",
        datatype: "json", // expecting JSON to be returned
        data: data,
        success: function(result) {
          if(result == 'success'){
            $(window).attr('location','/first_test/leave3');
          }else if(result == 'error'){
            alert('비밀번호가 다릅니다!');
            $(window).attr('location','/first_test/leave1');
          }
        },
        error: function(error) {
          alert('탈퇴 실패!');
        }
      })
    }//if
    });

    $('#rectangle_8_3').click(function() {
      $(window).attr('location','/first_test/leave3');
    });
    $('#logo').click(function(){
      $(window).attr('location','/first_test/main/1');
    });
});
