const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.status(200).json({message: 'Working'});
});

router.use('/customer', require('./models/customer/route'));
router.use('/product', require('./models/product/route'));
// router.use('/person', require('./models/person/route'));
// router.use('/relation', require('./models/relation/route'));


module.exports = router;
