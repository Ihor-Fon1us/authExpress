const express = require('express');
const UserService = require('../services/UserService');
const router = express.Router();
const validatorUserSchema = require('../models/validator/userSchema');
const userController = require('../controller/userController');
const Ajv = require("ajv");
const ajv = new Ajv();
const conf = require('../bin/config/config');

router.route('/')
  .get(userController.loginRequired(), async (req, res, next) => {
    if( req.user.name == conf.admin[0]) {
      console.log(await UserService.getAll());
      next();
    } else {
      res.redirect('/');
    }

  } , async (req, res, next) => {
    res.render('admin', {title: 'Express' });
  })
  .post(userController.loginRequired(), async (req, res, next) => {
    if (req.body.dellOneUser) {
      const id = req.body.dellId;
      await UserService.remove(id)
    } else if(req.body.dellAllUser) {
      await UserService.removeAll();
    } else {
      console.log('error post admin');
    }
    
    
  })

module.exports = router;