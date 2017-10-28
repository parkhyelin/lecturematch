//게시판 자바스크립트
//writeButton(글쓰기버튼)클릭시 글을 쓰기위한 모달창 생성
$(document).ready(function() {
  $('#writeButton').click(function() {
    $('#myModal').show('2000');
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
        alert('판매/구입 항목을 선택하세요');
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
          }
          else{
            console.log(result);
            alert('등록실패');
          }
        },
        error: function(error){
          alert('등록실패');
        }

     }).complete(function() {
        $(window).attr('location','/first_test/board');
      });
    });

//취소버튼(#out)누르면 모달창 닫힘
  $('#out').click(function() {
    $('#myModal').hide();
  });

//검색만드는중 미완성상태
  $('#searchButton').click(function(){
    var tag=$('#search').val();
    if(tag=='')
    alert('검색어를 입력하세요');
    var data={
      'tag':tag
    }
    $.ajax({
      type:'post',
      url:'/first_test/board/search',
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      data:data,
      datatype:'json',
      success:function(result){
        if(result=='success'){
          console.log('success');
          $('#lists').hide();
        }
        else{
          console.log('fails');
        }
      },
      error:function(error){
        console.log('server error');
      }

   });
  });




});
