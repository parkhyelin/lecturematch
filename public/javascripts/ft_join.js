$(document).ready(function() {

  var flag = false; //이메일 중복확인 플래그


  //////////////// join 1 /////////////////
  $('#rectangle_8_1').click(function(){
    $(window).attr('location','/first_test/main/1');
  });
  $('#rectangle_8_2').click(function(){

    //$(window).attr('location','/first_test/join2');
      var data = {
        'agree': 'agree'
      }
      $.ajax({
        type: "post",
        url: "/first_test/join1",
        datatype: "json", // expecting JSON to be returned
        data: data,
        cache:false,
        success: function(result) {
          if(result == 'success'){
            $(window).attr('location','/first_test/join2');
          }else if(result == 'error'){
            alert('에러');
            $(window).attr('location','/first_test/join1');
          }
        },
        error: function(error) {
          alert(error);
          $(window).attr('location','/first_test/join1');
        }
      })//ajax

  });

  //////////////////  join 2 ////////////////////

  $('#join_email').bind('input propertychange',function() {
      var user_email = $('#join_email').val();
      var data = {
        'email': user_email
      }
      $.ajax({
        type: "post",
        url: "/first_test/emailcheck",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        cache: false,
        datatype: "json", // expecting JSON to be returned
        data: data,
        success: function(result) {
          if(result == 'success'){
            $('#not_useful_email').css({"color":"red","visibility" : "hidden"});
            $('#useful_email').css({"color":"#4CAF50","visibility" : "visible"});
            flag = true;
            //가능한 이메일
          }else if(result == 'error'){
            //불가능한 이메일
            $('#useful_email').css({"color":"#4CAF50","visibility" : "hidden"})
            $('#not_useful_email').css({"color":"red","visibility" : "visible"});
            flag = false;
          }
        },
        error: function(error) {
          alert('error : emailcheck');
        }
      })
    });

    $('#join_cellphone').keyup(function(){
      var textinput = $("#join_cellphone").val();
      textinput = textinput.replace(/[^0-9]/g, '');
  		var tmp = ""

  		if (textinput.length > 3 && textinput.length <= 7) {
  			tmp += textinput.substr(0, 3);
  			tmp += '-';
  			tmp += textinput.substr(3);
  			$("#join_cellphone").val(tmp);
  		} else if (textinput.length > 7) {
  			tmp += textinput.substr(0, 3);
  			tmp += '-';
  			tmp += textinput.substr(3, 4);
  			tmp += '-';
  			tmp += textinput.substr(7);
  			$("#join_cellphone").val(tmp);
  		}
    });

    $('#joinButton').click(function() {
      var radio1 = $("input:radio[name=phoneradio]:checked").val();
      var user_email = $('#join_email').val();
      var user_name = $('#join_nickname').val();
      var user_password = $('#join_password').val();
      var user_phone = $('#join_cellphone').val();
      var user_password_check = $('#join_password_check').val();
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var email = $('#join_email').val();
      if(user_name == ''){
        alert("닉네임을 입력하세요");
      }else if(user_password == '' || user_password_check == ''){
        alert("비밀번호를 입력하세요");
      }else if(user_phone == ''){
        alert("핸드폰번호를 입력하세요");
      }else if(user_password.length<8){
        alert("비밀번호는 8자리 이상 입력하세요");
      }
      else if (email == '' || !re.test(email)) {
        alert("올바른 이메일 주소를 입력하세요");
      }else if(user_password_check != user_password){
        alert("비밀번호를 다시 확인하세요");
      }else if(!radio1){
        alert('전화번호 공개여부를 선택해주세요');
      }
      else if((flag === true && radio1 === '공개')||(flag === true && radio1 === '비공개')){
      var data = {
        'email': user_email,
        'name': user_name,
        'password': user_password,
        'phone':user_phone,
        'phoneopen' : radio1
      }
      $.ajax({
        type: "POST",
        url: "/first_test/join2",
        datatype: "json", // expecting JSON to be returned
        data: data,
        success: function(result) {
          $(window).attr('location','/first_test/join3');
        },
        error: function(error) {
          alert('가입 실패!');
        }
      }) //ajax
    }else if(flag === false){
        alert("이메일이 중복됩니다.");
      }

    });

    $('#cancelButton').click(function(){
      $(window).attr('location','/first_test');
    });

    $('#ok_button').click(function(){
      $(window).attr('location','/first_test/main/1');
    });



});
