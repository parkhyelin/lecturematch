$(document).ready(function() {
  $('#rectangle_8_1').click(function(){
    $(window).attr('location','/first_test/mypage');
  });

  $('#rectangle_8_2').click(function(){
    var password = $("#update_password_before").val();
    var data = {
      'password': password
    }
    $.ajax({
      type: "POST",
      url: "/first_test/updatebefore",

      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      data: data,
      success: function(result) {
        if(result == 'success'){
        $(window).attr('location','/first_test/updateinfo');
      }else if(result == 'error'){
          alert('비밀번호가 다릅니다.');
      }
      },
      error: function(error) {
        alert('실패!');
      }
    })
  });


  $('#update_cellphone').keyup(function(){
    var textinput = $("#update_cellphone").val();
    textinput = textinput.replace(/[^0-9]/g, '');
    var tmp = ""

    if (textinput.length > 3 && textinput.length <= 7) {
      tmp += textinput.substr(0, 3);
      tmp += '-';
      tmp += textinput.substr(3);
      $("#update_cellphone").val(tmp);
    } else if (textinput.length > 7) {
      tmp += textinput.substr(0, 3);
      tmp += '-';
      tmp += textinput.substr(3, 4);
      tmp += '-';
      tmp += textinput.substr(7);
      $("#update_cellphone").val(tmp);
    }
  });



  $('#updatefinButton').click(function() {
    var user_password = $('#update_password').val();
    var user_password_check = $('#update_password_check').val();
    var user_phone = $('#update_cellphone').val();
    var phoneopen = $("input:radio[name=phoneradio]:checked").val();


    if(user_password=='' || user_password_check=='' || user_phone == ''){
      alert('빈칸을 채워주세요');
      return false;
    }else if(!phoneopen){
      alert('번호 공개 여부를 선택해주세요');
      return false;
    }else if(user_password != user_password_check){
      alert('비밀번호가 다릅니다!');
      return false;
    }else if(user_password.length < 8){
      alert('비밀번호는 8자리 이상 입력하세요');
      return false;
    }else{
    var data = {
      'password': user_password,
      'phone': user_phone,
      'phoneopen' : phoneopen
    }
    $.ajax({
      type: "POST",
      url: "/first_test/updateinfo",

      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      data: data,
      success: function(result) {
        alert('수정 완료!');
        console.log(result);
        $(window).attr('location','/first_test/mypage');
      },
      error: function(error) {
        alert('수정 실패!');
      }
    })
  }
  });


  $('#cancelButton').click(function(){
    window.history.back();
  });
  $('#logo').click(function(){
    $(window).attr('location','/first_test/main/1');
  });
});
