var http = {
  _get(route, callback) {
    var xhr = xhrSetup('GET', route);
    xhr.onload = function() {
      _onload(xhr, callback);
    };
    xhr.send();
  },

  _post(route, data, callback) {
    var xhr = xhrSetup('POST', route);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onload = function() {
      _onload(xhr, callback);
    };
    xhr.send(JSON.stringify(data));
  },

  _put(route, data, callback) {
    var xhr = xhrSetup('PUT', route);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onload = function() {
      _onload(xhr, callback);
    };
    xhr.send(JSON.stringify(data));
  },

  _delete(route, callback) {
    var xhr = xhrSetup('DELETE', route);
    xhr.onload = function() {
      _onload(xhr, callback);
    };
    xhr.send();
  }
}

function xhrSetup(method, route) {
  var xhr = new XMLHttpRequest();
  // var host = location.host === 'localhost:3010' ? 'http://localhost:3000' : 'http://chaofz.me:3000';
  xhr.open(method, route, true);
  xhr.setRequestHeader('x-access-token', localStorage['token'] || '');
  return xhr;
}

function _onload(xhr, callback) {
  var res = {};
  try {
    res = JSON.parse(xhr.responseText);
  } catch(e) {
  }
  callback(xhr.status >= 200 && xhr.status < 400 ? null : res, res);
}

export default http;
