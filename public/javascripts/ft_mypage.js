$(document).ready(function() {
  $('#MailBoxbtn').click('show.bs.modal',function(event){
      $('#MailBoxModal').modal({
        remote : '/first_test/mailbox'
      });
    });
    $('#logo').click(function(){
      $(window).attr('location','/first_test/main/1');
    });
});
