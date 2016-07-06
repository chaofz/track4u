var express = require('express');
var auth = require('../controller/auth.service');

var router = express.Router();

// router.get('/login', auth.renderLogin);
// router.get('/register', auth.renderRegister);

router.post('/login', auth.login);
router.post('/register', auth.register);

router.get('/google', auth.authGoogle);
router.get('/google/callback', auth.googleCallback);

router.get('/facebook', auth.authFacebook);
router.get('/facebook/callback', auth.facebookCallback);

router.use(auth.isLoggedIn);

router.get('/local/link', auth.register);
router.put('/local/password', auth.changePassword);

router.get('/google/link', auth.authGoogle);
router.get('/google/link/callback', auth.googleCallback);
router.get('/google/unlink', auth.unlinkGoogle);

router.get('/facebook/link', auth.authFacebook);
router.get('/facebook/link/callback', auth.facebookCallback);
router.get('/facebook/unlink', auth.unlinkFacebook);

module.exports = router;
