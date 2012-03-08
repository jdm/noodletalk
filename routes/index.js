var gravatar = require('gravatar');
var request = require('request');

var settings = require('../settings');

var authUrl = 'https://browserid.org/verify';
var siteUrl = settings.options.domain;


// Home/main
exports.index = function(req, res) {
  res.render('index', { title: 'Noodle Talk' })
};

// Login
exports.login = function(req, res) {
  var qs = {
    assertion: req.body.bid_assertion,
    audience: siteUrl
  };

  var params = {
    url: authUrl,
    form: true,
    qs: qs
  };

  request.post(params, function(error, resp, body) {
    try {
      req.session.email = JSON.parse(body).email;
    } catch(e) {
      console.error('JSON failed to parse');
    }
    res.redirect('back');
  });
};


// Add new message
exports.message = function(req, res) {
  console.dir(req.body);
  res.json({
    message: req.body.message,
    gravatar: gravatar.url(req.session.email)
  });
}
