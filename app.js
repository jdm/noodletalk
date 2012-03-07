var querystring = require('querystring');
var request = require('request');

var routes = require('./routes');
var settings = require('./settings');

var app = settings.app;
var siteUrl = settings.options.domain;


// Main landing page
app.get('/', routes.index);

// Browser ID login
app.post('/login', function(req, res) {
  var authUrl = 'https://browserid.org/verify';
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
    req.session.email = JSON.parse(body).email;
    res.redirect('back');
  });
});

// Logout
app.get('/logout', function(req, res) {
  req.session.email = null;
  res.redirect('back');
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
