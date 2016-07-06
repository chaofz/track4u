module.exports = function(app, clientPath) {
  // setup routers
  app.use('/auth', require('./auth.route'));
  app.use('/api/users', require('./users.route'));
  app.use('/api/queries', require('./queries.route'));
  app.get('*', function(req, res) { res.sendFile(clientPath + '/index.html'); });
}
