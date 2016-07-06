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

var clientPath = path.join(__dirname, '../client');
if (app.get('env') === 'production') {
  clientPath = path.join(__dirname, '../client/dist');
}

app.use(express.static(clientPath));

// setup routers
require('./routes')(app, clientPath);

// app.use('/auth', require('./routes/auth.route'));
// app.use('/api/users', require('./routes/users.route'));
// app.use('/api/queries', require('./routes/queries.route'));
// app.get('*', function(req, res) { res.sendFile(clientPath + '/index.html'); });

var server = http.createServer(app).listen(config.port, function() {
  console.log('Server is listening on ' + config.port);
});

module.exports = app;
