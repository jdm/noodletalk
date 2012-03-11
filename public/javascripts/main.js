var socket = io.connect('http://localhost');


var updateMessage = function(data) {
  if($('li[data-created="'+ data.created +'"]').length < 1 &&
     data.created !== undefined) {
    var msg = $('<li data-created="'+ data.created +'"><img><span></span></li>');
    msg.find('img').attr('src', data.gravatar);
    msg.find('span').text(data.message);
    $('body ol').append(msg);
  }
}

var updateMessages = function() {
  document.getElementById('ping').contentDocument.location.reload(true);
}

setInterval("updateMessages()", 3000);


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
        updateMessage(data);
      },
      dataType: 'json'
    });
  });
});

socket.on('connect', function () {
  socket.on('message', function (data) {
    updateMessage(data);
  });
});