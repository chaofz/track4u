var express = require('express');
var auth = require('../controller/auth.service');
var controller = require('../controller/user.controller');

var router = express.Router();
router.use(auth.isLoggedIn);

router.route('/')
  .get(auth.isAdmin, controller.listAllUsers);

router.route('/me')
  .get(controller.me)
  .put(controller.updateFrequency) // maybe update profile
  .delete(controller.deleteMe);

router.route('/:id')
  .get(controller.showUser)
  .delete(auth.isAdmin, controller.deleteUser);

module.exports = router;
