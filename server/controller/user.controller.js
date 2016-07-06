var User = require('../model/user.model');

exports.listAllUsers = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(users);
  });
};

exports.me = function(req, res) {
  return res.json(req.user);
};

exports.updateFrequency = function(req, res) {
  var user = req.user;
  user.notifiFreq = req.body.notifiFreq;
  user.save(function(err) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.sendStatus(200);
  });
};

exports.deleteMe = function(req, res) {
  var user = req.user;
  user.remove(function(err) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.sendStatus(204);
  });
};

exports.showUser = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return res.status(500).json(err);
    }
    if (!user) {
      return res.status(404).json({ message: 'User cannot be found.' });
    }
    return res.json(user);
  });
};

exports.deleteUser = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.sendStatus(204);
  });
};
