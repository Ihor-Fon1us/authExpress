const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const validatorUserSchema = require('../models/validator/userSchema');
const Ajv = require("ajv")
const ajv = new Ajv()
const jsonwebtoken = require('jsonwebtoken');
const conf = require('../bin/config/config');
const { redirect } = require('express/lib/response');
const userController = require('../controller/userController')


router.route('/')
  .get( async (req, res, next) => {
    try {
      if(req.user) {
        res.render('index', {title: 'Express'});
      } else if(!req.user) {
        res.redirect('login')
      } else {
        next();
      }
    } catch (error) {
      next(error)
    }
    
    //res.clearCookie('foo');
    //await UserService.removeAll()
  })
  /* .post((req, res, next) => {

  }) */

module.exports = router;
