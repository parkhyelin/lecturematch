
$(document).ready(function() {
  $('#f_number').keyup(function(){
    var textinput = $("#f_number").val();
    textinput = textinput.replace(/[^0-9]/g, '');
    var tmp = ""

    if (textinput.length > 3 && textinput.length <= 7) {
      tmp += textinput.substr(0, 3);
      tmp += '-';
      tmp += textinput.substr(3);
      $("#f_number").val(tmp);
    } else if (textinput.length > 7) {
      tmp += textinput.substr(0, 3);
      tmp += '-';
      tmp += textinput.substr(3, 4);
      tmp += '-';
      tmp += textinput.substr(7);
      $("#f_number").val(tmp);
    }
  });

  $('#f_number2').keyup(function(){
    var textinput = $("#f_number2").val();
    textinput = textinput.replace(/[^0-9]/g, '');
    var tmp = ""

    if (textinput.length > 3 && textinput.length <= 7) {
      tmp += textinput.substr(0, 3);
      tmp += '-';
      tmp += textinput.substr(3);
      $("#f_number2").val(tmp);
    } else if (textinput.length > 7) {
      tmp += textinput.substr(0, 3);
      tmp += '-';
      tmp += textinput.substr(3, 4);
      tmp += '-';
      tmp += textinput.substr(7);
      $("#f_number2").val(tmp);
    }
  });

  /*
  $('#find_button').click(function(){
      var f_name = $('#f_name').val();
      var f_number = $('#f_number').val();
      var data = {
        'f_name': f_name,
        'f_number' : f_number
      }
      $.ajax({
        type: "post",
        url: "/first_test/findID_success",
        datatype: "json", // expecting JSON to be returned
        data: data,
        cache:false,
        success: function(result) {
          if(result == 'error'){
            alert('잘못된 유저정보');
          }else{
            $(window).attr('location','/first_test/findID_success');
          }
        },
        error: function(error) {
          alert(error);
        }
      })//ajax
  });

  $('#find_button2').click(function(){
    var f_name = $('#f_name').val();
    var f_number = $('#f_number').val();
    var f_email = $('f_email').val();
    var data = {
      'f_email' : f_email,
      'f_name': f_name,
      'f_number' : f_number
    }
      $.ajax({
        type: "post",
        url: "/first_test/findpwd_success",
        datatype: "json", // expecting JSON to be returned
        data: data,
        cache:false,
        success: function(result) {
          if(result == 'error'){
            alert('잘못된 유저정보');
          }else{
            $(window).attr('location','/first_test/findpwd_success');
          }
        },
        error: function(error) {
          alert(error);
        }
      })//ajax
  });
*/
});
