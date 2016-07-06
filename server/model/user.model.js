var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
    role: {
      type: String,
      default: 'user'
    },
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  notifiFreq: String
});

// // Validate empty email
// userSchema.path('local.email').validate(function(email) {
//   if (authTypes.indexOf(this.provider) !== -1) return true;
//   return email.length;
// }, 'Email cannot be blank');

// // Validate empty password
// userSchema.path('local.password').validate(function(password) {
//   if (authTypes.indexOf(this.provider) !== -1) return true;
//   return password.length;
// }, 'Password cannot be blank');


userSchema.methods = {
  hashPassword: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  checkPassword: function(password) {
    return bcrypt.compareSync(password, this.local.password);
  }
};

module.exports = mongoose.model('User', userSchema);
