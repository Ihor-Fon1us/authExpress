const express = require('express');
const UserService = require('../services/UserService');
const router = express.Router();
const validatorUserSchema = require('../models/validator/userSchema');
const userController = require('../controller/userController')
const Ajv = require("ajv")
const ajv = new Ajv()

router.route('/')
  .get(userController.loginRequired(false), async (req, res, next) => {
    res.render('admin', {title: 'Express' });
  })
  .post(async (req, res, next) => {
    const id = req.body.id;
    await UserService.remove(id)
  })

module.exports = router