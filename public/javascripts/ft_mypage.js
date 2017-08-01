$(document).ready(function() {
  $('#MailBoxbtn').click('show.bs.modal',function(event){
      $('#MailBoxModal').modal({
        remote : '/first_test/mailbox'
      });
    });
});
