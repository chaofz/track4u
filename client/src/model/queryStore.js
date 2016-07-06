var EventEmitter = require('events').EventEmitter;
// import EventEmitter from 'events';

var emitter = new EventEmitter();

var queries = [];

module.exports = {
// export default = {
  getQueries: function() {
    return queries.concat();
  },

  subscribe: function(callback) {
    emitter.on('update', callback);
  },

  unsubscribe: function(callback) {
    emitter.off('update', callback);
  },

  newQuery: function(message) {
    queries.push(message);
    emitter.emit('update');
  }
};
