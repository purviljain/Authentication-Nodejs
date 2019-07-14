$(function() {
  $('#create-form1').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      url: '/signup',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        name: $('#username1').val(),
        password: $('#password1').val()
    }),
      success: function(response){
        console.log(response);
        $('#msg').text(response.msg);
        $('#username1').val('');
        $('#password1').val('');
      }
    });
  });

  $('#create-form2').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      url: '/authenticate',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        name: $('#username2').val(),
        password: $('#password2').val()
    }),
      success: function(response){
        console.log(response);
        $('#msg2').text(response.msg);
        $('#memberinfo').show();
        $('#username2').val('');
        $('#password2').val('');
      }
    });
  });

  $('#memberinfo').on('click', function(){
    // $.ajax({
    //   url: '/memberinfo',
    //   // contentType: 'application/json',
    //   dataType: 'JSON',
    //   success: function(response) {
    //     console.log(response);
    //     $('#msg2').text(response.msg);
    //     }
    // });
    $.get("/memberinfo", function(response) {
      console.log(response);
      $('#msg2').text(response.msg);
    });
  });

});
