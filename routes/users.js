const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

/* GET users listing. */
router.get('/',userController.loginRequired(), function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
