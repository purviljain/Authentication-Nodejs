$(function() {
  $('#form1').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      url: '/api/signup',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        name: $('#username1').val(),
        password: $('#password1').val()
    }),
      success: function(response){
        console.log(response);
        $('#msg').text(response.message);
        $('#username1').val('');
        $('#password1').val('');
      }
    });
  });

  $('#form2').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      url: '/api/authenticate',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        name: $('#username2').val(),
        password: $('#password2').val()
    }),
      success: function(response){
        console.log(response);
        $('#msg2').text(response.message);
        $('#memberinfo').show();
        $('#username2').val('');
        $('#password2').val('');
        $('#token-input').val(response.token);
      }
    });
  });

  // $('#form3').on('submit', function(event){
  //   event.preventDefault();
  //   $.ajax({
  //     url: '/api/auth/memberinfo',
  //     method: 'POST',
  //     contentType: 'application/json',
  //     headers: {
  //       "token": $('#token-input').val()
  //     },
  //     data: JSON.stringify({
  //       token: $('#token-input').val()
  //     }),
  //     success: function(response){
  //       console.log(response);
  //       $('#info').text(response.message);
  //     }
  //   });
  // });

  $('#memberinfo').on('click', function(){
    $.ajax({
      url: '/api/auth/memberinfo',
      method: 'GET',
      contentType: 'application/json',
      headers: {
        token: $('#token-input').val()
      },
      data: JSON.stringify({
        token: $('#token-input').val()
      }),
      success: function(response) {
        console.log(response);
        $('#info').text(response.message);
        }
    });
    // $.get("/memberinfo", function(response) {
    //   console.log(response);
    //   $('#msg2').text(response.msg);
    // });
  });

});
