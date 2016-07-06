var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var querySchema = mongoose.Schema({
  semester: String,
  subject: String,
  courseNo: String,
  section: String,
  userId: String,
  lastEmailTime: Date
});

// // Validate empty email
// querySchema.path('local.email').validate(function(email) {
//   if (authTypes.indexOf(this.provider) !== -1) return true;
//   return email.length;
// }, 'Email cannot be blank');

// // Validate empty password
// querySchema.path('local.password').validate(function(password) {
//   if (authTypes.indexOf(this.provider) !== -1) return true;
//   return password.length;
// }, 'Password cannot be blank');


querySchema.methods = {
  hashPassword: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  checkPassword: function(password) {
    return bcrypt.compareSync(password, this.local.password);
  }
};

module.exports = mongoose.model('Query', querySchema);
