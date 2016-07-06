var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../model/user.model');
var config = require('../config/index');

// ======================== Local Auth ==================================
// exports.renderLogin = function(req, res) {
//   // res.render('login.ejs', { message: 'loginMessage' });
// };

// exports.renderRegister = function(req, res, next) {
//   // res.render('signup.ejs', { message: 'signupMessage' });
// };

exports.login = function(req, res) {
  passport.authenticate('localLogin', function(err, user, info) {
    handleErrAndSendToken(err, user, info, res);
  })(req, res);
};

exports.register = function(req, res) {
  passport.authenticate('localRegister', function(err, user, info) {
    handleErrAndSendToken(err, user, info, res);
  })(req, res);
};

exports.changePassword = function(req, res) {
  var user = req.user;
  var oldPass = String(req.body.oldPass);
  var newPass = String(req.body.newPass);
  var newPassrp = String(req.body.newPassrp);
  if (newPass != newPassrp ) {
    return res.status(400).json({ message: "New passwords do not match." });
  }
  if (!user.checkPassword(oldPass)) {
    return res.status(403).json({ message: "The old password doesn't match." });
  }
  user.local.password = user.hashPassword(newPass);
  user.save(function(err) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.sendStatus(200);
  });
};

// ======================== Google Auth ==================================
exports.authGoogle = passport.authenticate('google', {
  failureRedirect: '/',
  scope: ['profile', 'email'],
  session: false
});

exports.googleCallback = function(req, res) {
  passport.authenticate('google', function(err, user, info) {
    if (err) {
      return res.status(401).json(err);
    }
    if (!user) {
      return res.status(404).json({ message: "Cannot process the request." });
    }
    var token = signToken(user._id);
    res.redirect('/dashboard?token=' + JSON.stringify(token));
    // handleErrAndSendToken(err, user, info, res);
  })(req, res);
};

exports.unlinkGoogle = function(req, res) {
  var user = req.user;
  user.google = undefined;
  user.save(function(err) {
    if (err) {
      return res.status(500).json(err);
    }
    res.redirect('/dashboard');
  });
};

// ======================== Facebook Auth ==================================
exports.authFacebook = passport.authenticate('facebook', {
  failureRedirect: '/',
  scope: 'email'
});

exports.facebookCallback = function(req, res) {
  passport.authenticate('facebook', function(err, user, info) {
    res.redirect('/dashboard');
    // handleErrAndSendToken(err, user, info, res);
  })(req, res);
}

exports.unlinkFacebook = function(req, res) {
  var user = req.user;
  user.facebook = undefined;
  user.save(function(err) {
    if (err) {
      return res.status(500).json(err);
    }
    res.redirect('/dashboard');
  });
};

// ======================== Auth Middleware ==================================
var verifyToken = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
    req.decoded = decoded;
    next();
  });
};

var findAndMatchUser = function(req, res, next) {
  User.findById(req.decoded._id, function(err, user) {
    if (err) {
      return res.status(500).json({ message: "User doesn't exit." });
    }
    if (!user) {
      return res.status(401).json({ message: "User doesn't exit." });
    }
    req.user = user;
    next();
  });
};

exports.isLoggedIn = [verifyToken, findAndMatchUser];

exports.isAdmin = function(req, res, next) {
  if (req.user.local.role !== 'admin') {
    return res.status(403).json({ message: "Sorry, you don't have permission for this." });
  }
  next();
};

// exports.validatePost = function(req, res, next) {
//   var query = req.body
//   if(!query.semester || !query.subject || !query.courseNo) {
//     return res.status(400).json({ message: 'Query malformed.' });
//   }
//   next();
// }

// ======================== Utils ==================================
var signToken = function(id) {
  return jwt.sign({ _id: id }, config.secret, { expiresIn: '5d' });
};

var handleErrAndSendToken = function(err, user, info, res) {
  if (err) {
    return res.status(401).json(err);
  }
  if (!user) {
    return res.status(404).json({ message: "Cannot process the request." });
  }
  var token = signToken(user._id);
  res.json({ token: token });
};

var stringify = function(obj) {
  var str = '';
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str += p + '::' + obj[p] + '\n';
    }
  }
  return str;
};
