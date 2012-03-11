$(function() {
  var socket = io.connect('http://localhost');

  var updateMessage = function(data) {
    if($('li[data-created="'+ data.created +'"]').length < 1 && data.created !== undefined) {
      var msg = $('<li data-created="'+ data.created +'"><img><p></p>' +
                  '<a href="#" class="delete">delete</a></li>');
      msg.find('img').attr('src', data.gravatar);
      msg.find('p').html(data.message);
      $('body ol').prepend(msg);
    }
  };

  var submitLogin = function() {
    $('#login-form').submit(function(ev) {
      ev.preventDefault();
      this.submit
    });
  };

  $('#login').click(function() {
    navigator.id.getVerifiedEmail(function(assertion) {
      if(assertion) {
        var loginForm = $('#login-form');

        loginForm.find('input').val(assertion);
        $.post('/login', loginForm.serialize(), function(data) {
          document.location.href = '/';
        });
      }
    });
  });

  $('form').submit(function(ev) {
    ev.preventDefault();
    var self = $(this);

    $.ajax({
      type: 'POST',
      url: self.attr('action'),
      data: self.serialize(),
      success: function(data) {
        updateMessage(data);
        $('form input').val('');
      },
      dataType: 'json'
    });
  });

  $('ol').on('click', 'li a.delete', function(ev) {
    ev.preventDefault();
    $(this).closest('li').remove();
  });

  socket.on('connect', function () {
    socket.on('message', function (data) {
      updateMessage(data);
    });
  });
});
