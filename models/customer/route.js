const express = require('express');
const passport = require('passport');
const router = express.Router();

const customerContrller = require('./controller');

router.post('/create', customerContrller.create);
router.post('/login', passport.authenticate('local'), customerContrller.login);
router.get('/get', passport.authenticate('jwt', { session: false }), customerContrller.get);

module.exports = router;