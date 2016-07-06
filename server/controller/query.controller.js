var Query = require('../model/query.model');
var _ = require('lodash');

exports.listQueriesOfMe = function(req, res) {
  Query.find({ userId: req.user._id }, function(err, queries) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(queries);
  });
};

exports.createQueryForMe = function(req, res) {
  req.body.userId = req.user._id;
  Query.create(req.body, function(err, query) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(201).json(query);
  });
};

exports.ownsQuery = function(req, res, next) {
  Query.findById(req.params.id, function(err, query) {
    if (err) {
      return res.status(500).json(err);
    }
    if (!query) {
      return res.status(404).json({ message: 'Query cannot be found.' });
    }
    if (String(req.user._id) !== query.userId) {
      return res.status(403).json({ message: "Sorry, you don't own this query." });
    }
    req.query = query;
    next();
  });
};

exports.validatePost = function(req, res, next) {
  var query = req.body
  if(!query.subject || !query.courseNo || !query.section) {
    return res.status(400).json({ message: 'Not a valid query.' });
  }
  next();
}

exports.showQuery = function(req, res) {
  return res.json(req.query);
};

exports.updateQuery = function(req, res) {
  var updated = _.merge(req.query, req.body);
  updated.save(function(err) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(updated);
  });
};

exports.deleteQuery = function(req, res) {
  var query = req.query;
  query.remove(function(err) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.sendStatus(204);
  });
};
