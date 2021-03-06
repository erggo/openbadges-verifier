
/**
 * Module dependencies.
 */

var express = require('express')
  // , routes = require('./routes')
  , png = require('./routes/png')
  , nunjucks = require('nunjucks')
  , http = require('http')
  , path = require('path');

var app = express();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));
env.express(app);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {res.render('index.html');});
app.post('/', png.details);
app.post('/check', png.check);
app.post('/api', png.api);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
