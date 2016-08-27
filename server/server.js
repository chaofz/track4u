process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var http = require('http');
var path = require('path');
var config = require('./config');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.database);
require('./config/passport.config').setup(); // setup passport strategies

var clientPath = path.join(__dirname, app.get('env') === 'production' ? '../client/public' : '../client');

app.use(express.static(clientPath));

require('./routes')(app, clientPath); // setup routers

var server = http.createServer(app).listen(config.port, function() {
  console.log('Server is listening on ' + config.port);
});

module.exports = app;
