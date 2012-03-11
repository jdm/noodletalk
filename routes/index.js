var gravatar = require('gravatar');
var request = require('request');

var auth = require('../lib/authenticate');

var settings = require('../settings');
var io = require('socket.io').listen(settings.app);
var message = {};


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


// Home/main
exports.index = function(req, res) {
  res.render('index', { title: 'Noodle Talk' });
};


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
  var message = getMessage(req);
  io.sockets.emit('message', message);
  res.json(message);
}


// Logout
exports.logout = function(req, res) {
  req.session.email = null;
  res.redirect('/');
};


