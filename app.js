var https = require('https');
var querystring = require('querystring');
var routes = require('./routes');

var settings = require('./settings');

var app = settings.app;
var siteUrl = settings.options.domain;


// Main landing page
app.get('/', routes.index);

// Browser ID login
app.post('/login', function(req, res) {
  var bid_response = '';
  var post_data = querystring.stringify({
    'assertion': req.body.bid_assertion,
    'audience' : siteUrl,
  });

  var post_options = {
    host: 'browserid.org',
    path: '/verify',
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };

  var post_req = https.request(post_options, function(resp) {
    var body = '';
    resp.setEncoding('utf-8');
    resp.on('data', function(data) { body += data; });
    resp.on('end', function() {
      var bid_response = JSON.parse(body);
      req.session.email = bid_response.email;
      res.redirect('back');
    });
  });

  post_req.write(post_data);
  post_req.end();
});

// Logout
app.get('/logout', function(req, res) {
  req.session.email = null;
  res.redirect('back');
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
