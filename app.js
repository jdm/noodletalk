var routes = require('./routes');
var settings = require('./settings');

var app = settings.app;


app.get('/', routes.index);
app.get('/ping', routes.ping);
app.post('/login', routes.login);
app.post('/message', routes.message);
app.get('/logout', routes.logout);

app.listen(settings.options.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
