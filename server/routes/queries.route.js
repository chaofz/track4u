var express = require('express');
var auth = require('../controller/auth.service');
var controller = require('../controller/query.controller');

var router = express.Router();
router.use(auth.isLoggedIn);

// /queries
router.route('/')
  .get(controller.listQueriesOfMe)
  .post(controller.validatePost, controller.createQueryForMe);

router.route('/:id')
  .all(controller.ownsQuery)
  .get(controller.showQuery)
  .put(controller.validatePost, controller.updateQuery)
  .delete(controller.deleteQuery);

module.exports = router;
