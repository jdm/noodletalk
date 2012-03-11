var request = require('request');

var settings = require('../settings');

var authUrl = settings.options.authUrl + '/verify';
var siteUrl = settings.options.domain + ':' + settings.options.port;


// Browser ID authentication
exports.verify = function(req, callback) {
  var qs = {
    assertion: req.body.bid_assertion,
    audience: siteUrl
  };

  var params = {
    url: authUrl,
    form: qs
  };

  request.post(params, function(error, resp, body) {
    var email = false;

    if(error) {
      return callback(error);
    }

    try {
      var jsonResp = JSON.parse(body);
      if(!error && jsonResp.status === 'okay') {
        email = jsonResp.email;
      } else {
        error.type = 'invalid_http_response';
        error.body('HTTP Status not okay');
        return callback(error);
      }
    } catch(error) {
      error.type = 'parse_error';
      error.body('JSON failed to parse');
      return callback(error);
    }

    return callback(null, email);
  });
};
