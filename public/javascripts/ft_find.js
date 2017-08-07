
$(document).ready(function() {
  $('#find_button').click(function(){
    var name=$('#f_name').val();
    var number=$('#f_number').val();
    if(name==''){
      alert('이름을 입력하세요');
    }
    else if(number==''){
      alert('번호를 입력하세요');
    }
    else{
      var data={
        'name':name,
        'number':number
      }
      $.ajax({
        type:'post',
        url: '/first_test/findID_success',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        cache: false,
        data: data,
        datatype: 'json',
        success:function(result){
          if(result=='success')
          console.log('success');
          else{
            console.log('ffaaiill');
          }
        },
        error:function(error){
          console.log(error);
        }
      })
    }
  })
});
