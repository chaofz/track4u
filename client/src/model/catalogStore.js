import http from '../controller/appHttp.js';

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}

var catalog = {};
var subjects = [];

module.exports = {

  loadCatalog(callback) {
    // if (localStorage.catalog) {
    //   callback(null, localStorage.getObject('catalog'));
    //   return;
    // }
    http._get('/data/1168_sects.json', function(err, res) {
      if (err) {
        return;
      }
      catalog = res;
      subjects = Object.keys(catalog);
      localStorage.setObject('catalog', res);
      callback(err, res);
    });
  },

  getMatchedSubjects(heading) {
    heading = heading.toUpperCase();
    var matches = subjects.filter((subject) => subject.startsWith(heading));
    if(matches.length === 0)
      return 'no matches';
    return matches;
  },

  getMatchedCourseNo(subject, heading) {
    if(!subject || subject === '') {
      return null;
    }
    var matches = Object.keys(catalog[subject]).filter((courseNo) => courseNo.startsWith(heading));
    if(matches.length === 0)
      return 'no matches';
    return matches;
  },

  getMatchedSections(subject, courseNo, heading) {
    if(!subject || subject === '' || !courseNo || courseNo === '') {
      return null;
    }
    var matches = catalog[subject][courseNo].filter((sections) => sections.startsWith(heading));
    if(matches.length === 0)
      return 'no matches';
    return matches;
  },

  checkClass(query) {
    try {
      return catalog[query.subject][query.courseNo].includes(query.section);
    } catch(e) {
      return false;
    }
  }
};

var stringify = function(obj) {
  var str = '';
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var line = p + '::' + obj[p] + '\n';

      str += line;
    }
  }
  return str;
}

// export default catalog;
