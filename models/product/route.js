const express = require('express');
const passport = require('passport');
const router = express.Router();

const productController = require('./controller');

router.post('/load-products', productController.loadProducts);
router.get('/get', passport.authenticate('jwt', { session: false }), productController.get);
router.get('/list', passport.authenticate('jwt', { session: false }), productController.list);
router.post('/update', passport.authenticate('jwt', { session: false }), productController.update);

module.exports = router;