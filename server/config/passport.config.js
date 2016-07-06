var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../model/user.model');
var config = require('./auth.config');

exports.setup = function() {

  // ======================== Local Auth Configration===============================
  passport.use('localLogin', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    },
    function(email, password, done) {
      email = email.toLowerCase();
      User.findOne({ 'local.email': email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user || !user.checkPassword(password)) {
          return done(err = { message: "Invalid email or password." });
        }
        return done(null, user);
      });
    }));

  passport.use('localRegister', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // to check if a user is logged in or not
    },
    function(req, email, password, done) {
      email = email.toLowerCase();
      if (req.user && req.user.local.email) { // has both OAuth and local account
        return done(err = { message: 'Track4U account has already been created.' });
      }
      // register local or link local
      User.findOne({ 'local.email': email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(err = { message: 'This email has been registered.' });
        }
        saveLocalAccount(req, email, password, done);
      });
    }));

  var saveLocalAccount = function(req, email, password, done) {
    var user = req.user;
    if (!req.user) {
      user = new User();
    }
    user.local.email = email;
    user.local.password = user.hashPassword(password);
    user.save(function(err) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  };

  // ======================== Google Auth Configration ===============================
  passport.use(new GoogleStrategy({
      clientID: config.googleAuth.clientID,
      clientSecret: config.googleAuth.clientSecret,
      callbackURL: config.googleAuth.callbackURL,
      passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
      saveGoogleAccount(req, token, profile, done);
    }));

  var saveGoogleAccount = function(req, token, profile, done) {
    var user = req.user;
    if (!req.user) {
      user = new User();
    }
    user.google.id = profile.id;
    user.google.token = token;
    user.google.name = profile.displayName;
    user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
    user.save(function(err) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  };

  // ======================== Facebook Auth Configration ===============================
  passport.use(new FacebookStrategy({
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL,
      profileFields: ['id', 'name', 'email'],
      passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
      saveFacebookAccount(req, token, profile, done);
    }));

  var saveFacebookAccount = function(req, token, profile, done) {
    var user = req.user;
    if (!req.user) {
      user = new User();
    }
    user.facebook.id = profile.id;
    user.facebook.token = token;
    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
    user.facebook.email = (profile.emails[0].value || '').toLowerCase();
    user.save(function(err) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  }
};
