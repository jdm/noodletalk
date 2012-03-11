var gravatar = require('gravatar');
var request = require('request');

var auth = require('../lib/authenticate');

var settings = require('../settings');
var io = require('socket.io').listen(settings.app);
var message = {};


// Home/main
exports.index = function(req, res) {
  res.render('index', { title: 'Noodle Talk' });
};


// Ping
exports.ping = function(req, res) {
  res.render('ping', { title: 'Ping' });
}


// Login
exports.login = function(req, res) {
  auth.verify(req, function(error, email) {
    if(email) {
      res.cookie('rememberme', 'yes', {
        secure: settings.options.secureCookie,
        httpOnly: true
      });
      req.session.email = email;
    }
    res.redirect('back');
  });
};


// Add new message
exports.message = function(req, res) {
  res.json(getMessage(req));
}


// Logout
exports.logout = function(req, res) {
  req.session.email = null;
  res.redirect('/');
};


var getMessage = function(req) {
  if(req.body) {
    message = {
      message: req.body.message,
      gravatar: gravatar.url(req.session.email),
      created: Math.round(new Date().getTime() / 1000)
    };

    return message;
  };
}


io.sockets.on('connection', function (socket) {
  socket.broadcast.emit('message', message);
});
