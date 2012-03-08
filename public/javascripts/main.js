$(function() {
  $('#login').click(function() {
    navigator.id.getVerifiedEmail(function(assertion) {
      if(assertion) {
        $('form input').val(assertion);
        $('form').submit();
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
        var message = $('<li><img><span></span></li>');
        message.find('img').attr('src', data.gravatar);
        message.find('span').text(data.message);
        $('body ol').append(message);
      },
      dataType: 'json'
    });
  });
});