$(document).ready(function(){
  $('#loginButton').click(function(){
    var user_email = $('#login_email').val();
    var user_password = $('#login_password').val();

    if(user_email == '' || user_password == ''){
        alert('빈칸을 채워주세요');
      }
    else{
    var data= {
      'email' : user_email,
      'password' : user_password
    }
    $.ajax({
      type : "POST",
      url : "/first_test/login",
      contentType : "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype : "json",
      data : data,
      success : function(result){
        if(result == 'success'){
        console.log(result);
        $(window).attr('location','/first_test/main/1');
      }
      if(result == 'error'){
        alert('없는 이메일이거나 비밀번호가 다릅니다.');
        $(window).attr('location','/first_test/login');
      }
      },
      error: function(error){
        alert('로그인 실패');
        $(window).attr('location','/first_test/login');
      }
    })
  }
  });

  $('#login_JoinButton').click(function(){
    $(window).attr('location','/first_test/join1');
  });

  $('#find_id_and_password').click(function(){
    $(window).attr('location','/first_test/findID');
  });

  $('#logo').click(function(){
    $(window).attr('location','/first_test/main/1');
  });
  $('#first_join').click(function(){
    $(window).attr('location','/first_test/join1');
  });
  $('#first_login').click(function(){
    $(window).attr('location','/first_test/login');
  });
  $('#input_area').keypress(function(event){
     if ( event.which == 13 ) {
         $('#loginButton').click();
         return false;
     }
});
});
