/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require("connect-mongo");
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
// app.use(app.router);
app.use(express.router(routes));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({
	secret : settings.cookieSecret,
	store : new MongoStore({
		db : settings.db
	})
}))

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get(/^\/sap\/(\w+)(?:\.\.(\w+)\.\.(\w+)\.\.(\w+)\.\.(\w+))$/, routes.index);
app.get(/^\/ufo\/(\w+)(?:\.\.(\w+)\.\.(\w+))?$/, routes.index);
app.get('/users', user.list);
app.get('/list', routes.list);

http.createServer(app).listen(app.get('port'), "0.0.0.0", function() {
	console.log('Express server listening on port ' + app.get('port'));
});
