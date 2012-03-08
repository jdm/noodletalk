var routes = require('./routes');
var settings = require('./settings');

var app = settings.app;


app.get('/', routes.index);
app.post('/login', routes.login);
app.post('/message', routes.message);

// Logout
app.get('/logout', function(req, res) {
  req.session.email = null;
  res.redirect('back');
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
