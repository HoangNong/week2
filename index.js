// mongoose setup
require( './db' );
 
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var ect = require('ect');
var ectRenderer = ect({watch: true, root: __dirname + '/views', ext: '.ect'});
 
// all environments
app.set('port', 3000);
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
app.use('/public', express.static(path.resolve(__dirname, './public')));
 
app.get('/', routes.index);
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});