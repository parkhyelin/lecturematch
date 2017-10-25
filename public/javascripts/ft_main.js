
    //게시판 자바스크립트
    //writeButton(글쓰기버튼)클릭시 글을 쓰기위한 모달창 생성
    $(document).ready(function() {
      $('#writeButton').click(function() {
        $('#myModal').show('2000');
    });

          $('#MailBoxbtn').click('show.bs.modal',function(event){
              $('#MailBoxModal').modal({
                remote : '/first_test/mailbox'
              });
            });
    //글을 다쓰고 등록버튼(#ok)을 누르면 글이 저장이됨
        $('#ok').click(function() {
          var choice = $("input:radio[name=choice]:checked").val();
          var title = $('#title').val();
          var text = $('#content').val();
          var today = new Date();
          var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          if (title == '')
            alert("제목을 입력하세요");
          else if (choice == '')
            alert('버림/구함 항목을 선택하세요');
          var data = {
            'choice': choice,
            'title': title,
            'text': text,
            'date': date
          }
          $.ajax({
            type: 'post',
            url: '/first_test/board',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            cache: false,
            data: data,
            datatype: 'json',
            success: function(result) {
              if (result == 'success')
              {
                console.log(result);
                alert('등록완료');
                $(window).attr('location','/first_test/main/1');
              }
              else{
                console.log(result);
                alert('등록실패');
              }
            },
            error: function(error){
              alert('등록실패');
            }

         })
        });

    //취소버튼(#out)누르면 모달창 닫힘
      $('#out').click(function() {
        $('#myModal').hide();
      });
      $('button.close').click(function() {
        $('#myModal').hide();
      });
      $('button.close').click(function() {
        $('#write_matching_modal').hide();
      });
      //강의교환 글쓰기
      $('#OKbtn').click(function(){
        var class_name = $('#class_name').val();
        var prof_name = $('#prof_name').val();
        var time = $('#time').val();
        var change_class_name = $('#change_class_name').val();
        var change_prof_name = $('#change_prof_name').val();
        var change_time = $('#change_time').val();

        if(class_name === '' || prof_name === '' || time === '' || change_class_name === '' || change_time ==='' || change_prof_name === '' ){
            alert ('빈칸을 채워주세요!');
        }else {
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
            $(window).attr('location','/first_test/main/1');
          },
          error: function(error){
            alert(error);
          }
        });
      }
      });

      if (location.hash) {
      $('a[href=\'' + location.hash + '\']').tab('show');
    }
    var activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
      $('a[href="' + activeTab + '"]').tab('show');
    }

    $('body').on('click', 'a[data-toggle=\'tab\']', function (e) {
      e.preventDefault()
      var tab_name = this.getAttribute('href')
      if (history.pushState) {
        history.pushState(null, null, tab_name)
      }
      else {
        location.hash = tab_name
      }
      localStorage.setItem('activeTab', tab_name)

      $(this).tab('show');
      return false;
    });
    $(window).on('popstate', function () {
      var anchor = location.hash ||
        $('a[data-toggle=\'tab\']').first().attr('href');
      $('a[href=\'' + anchor + '\']').tab('show');
    });
    $('#logo').click(function(){
      $(window).attr('location','/first_test/main/1');
    });
    $('#book_mark').click(function(){
      $(window).attr('location','/first_test/main/1s');
    });
    });
