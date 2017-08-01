$(document).ready(function(){
  //$('#myTab a:first').tab('show')

  $('#RecvMailBoxbtn').click('show.bs.modal',function(event){
      $('#RecvMailBoxModal').modal({
        remote : '/first_test/recvmailbox'
      });
    });

    $('#SendMailBoxbtn').click('show.bs.modal',function(event){
        $('#SendMailBoxModal').modal({
          remote : '/first_test/sendmailbox'
        });
      });

      $('#MailBoxbtn').click('show.bs.modal',function(event){
          $('#MailBoxModal').modal({
            remote : '/first_test/mailbox'
          });
        });

  //쪽지 보내기
  $('#SendMailbtn_modal').click(function(){
    var recv_email = $('#recipient_email').val();
    var content = $('#message_text').val();
    var now = new Date();
    function leadingZeros(n, digits){
      var zero='';
      n = n.toString();
      if(n.length < digits){
        for(i = 0 ; i < digits - n.length; i++){
          zero += '0';
        }
      }
      return zero + n;
    }
    var date_sent = leadingZeros(now.getYear()-100,2)+ '-'+
                    leadingZeros(now.getMonth()+1,2)+'-' +
                    leadingZeros(now.getDate(),2)+' ['+
                    leadingZeros(now.getHours(),2)+':'+
                    leadingZeros(now.getMinutes(),2)+']';
    var data= {
      'recv_email' : recv_email,
      'content' : content,
      'date_sent' : date_sent
        }
    $.ajax({
      type : "POST",
      url : "/first_test/sendmail",
      datatype : "json",
      data : data,
      success : function(result){
        if(result == 'success'){
        console.log(result);
        alert('메일보내기 성공');
        $(window).attr('location','/first_test');
      }else if(result == 'error'){
        alert('자기자신한테는 쪽지를 보낼수 없습니다!');
        }
      }
      ,
      error: function(error){
        alert('메일보내기 실패');
      }
    })
  });

    //강의교환 글쓰기
    $('#OKbtn').click(function(){
      var class_name = $('#class_name').val();
      var prof_name = $('#prof_name').val();
      var time = $('#time').val();
      var change_class_name = $('#change_class_name').val();
      var change_prof_name = $('#change_prof_name').val();
      var change_time = $('#change_time').val();

      var now = new Date();
      function leadingZeros(n, digits){
        var zero='';
        n = n.toString();
        if(n.length < digits){
          for(i = 0 ; i < digits - n.length; i++){
            zero += '0';
          }
        }
        return zero + n;
      }
      var post_date = leadingZeros(now.getYear()-100,2)+ '-'+
                      leadingZeros(now.getMonth()+1,2)+'-' +
                      leadingZeros(now.getDate(),2)+' ['+
                      leadingZeros(now.getHours(),2)+':'+
                      leadingZeros(now.getMinutes(),2)+']';
      var data= {
        'class_name' : class_name,
        'prof_name' : prof_name,
        'time' : time,
        'change_class_name' : change_class_name,
        'change_prof_name' : change_prof_name,
        'change_time' : change_time,
        'post_date' : post_date
          }
      $.ajax({
        type : "POST",
        url : "/first_test/writematching",
        datatype : "json",
        data : data,
        success : function(result){
          console.log(result);
          alert('글쓰기 성공');
          $(window).attr('location','/first_test');
        },
        error: function(error){
          alert(error);
        }
      });
    });

});
