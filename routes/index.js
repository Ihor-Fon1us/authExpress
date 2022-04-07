const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const validatorUserSchema = require('../models/validator/userSchema');
const Ajv = require("ajv")
const ajv = new Ajv()
const jsonwebtoken = require('jsonwebtoken');
const userController = require('../controller/userController')


router.route('/')
  .get( async (req, res, next) => {
    try {
      if(req.user) {
        next();
      } else if(!req.user) {
        res.redirect('login')
      } else {
        next();
      }
    } catch (error) {
      next(error)
    }
  }, userController.loginRequired(), (req, res, next) => {
    res.render('index', {title: 'Express'});
  })
  .post(userController.loginRequired(), async (req, res, next) => {
    if(req.body.searchBtn) {
      //search
    } else if(req.body.home) {
      return res.redirect('/');
    } else if(req.body.download) {
      return res.redirect('/public/file/mc.exe');
    } else {
      console.log('error post index');
    }
  }) 

module.exports = router;
