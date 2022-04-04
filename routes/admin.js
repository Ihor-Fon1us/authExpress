const express = require('express');
const UserService = require('../services/UserService');
const router = express.Router();
const validatorUserSchema = require('../models/validator/userSchema');
const userController = require('../controller/userController');
const adminController = require('../controller/adminController');
const Ajv = require("ajv");
const ajv = new Ajv();
const conf = require('../bin/config/config');

router.route('/')
  .get(userController.loginRequired(), adminController.adminConfirm() , async (req, res, next) => {
    const users = await UserService.getAll();
    res.render('admin', {title: 'Express', layout : 'layout', json: users});
  })
  .post(userController.loginRequired(), adminController.adminConfirm(), async (req, res, next) => {
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