var https = require('https');
var querystring = require('querystring');
var routes = require('./routes');

var app = require('./settings');

// Routes

app.get('/', routes.index);

app.post('/login', function(req, res) {
    var post_data = querystring.stringify({
        'assertion': req.body.bid_assertion,
        'audience' : 'http://localhost:3000',
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

    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf-8');
        res.on('data', function(data) {
            var bid_response = JSON.parse(data);
            req.session.email = bid_response.email;
            console.log(req.session.email);
        });
    });

    post_req.write(post_data);
    post_req.end();

    res.redirect('back');
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
