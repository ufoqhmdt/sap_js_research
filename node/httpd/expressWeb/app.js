/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require("./settings");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.session({
	secret : settings.cookie_secret,
	store : new MongoStore({
		db : settings.db
	})
}));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// app.get(/^\/sap\/(\w+)(?:\.\.(\w+)\.\.(\w+)\.\.(\w+)\.\.(\w+))$/, routes.test);
// app.get(/^\/ufo\/(\w+)(?:\.\.(\w+)\.\.(\w+))?$/, routes.test);
app.get('/users', user.list);
app.get('/list', routes.list);

// app.get("/", routes.index);
// app.get("/u/:user", routes.user);
// app.post("/post", routes.post);
// app.get("/reg", routes.reg);
// app.post("/doReg", routes.doReg);
// app.get("/login", routes.login);
// app.post("/doLogin", routes.doLogin);
// app.get("/logout", routes.logout);


app.configure('development', function () {
    app.use(express.errorHandler());
});

routes(app);//这个是新加的


http.createServer(app).listen(app.get('port'), "0.0.0.0", function() {
	console.log('Express server listening on port ' + app.get('port'));
});
