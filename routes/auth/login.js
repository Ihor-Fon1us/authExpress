const express = require('express');
const router = express.Router();
const UserService = require('../../services/UserService');
const validatorUserSchema = require('../../models/validator/userSchema');
const Ajv = require("ajv")
const ajv = new Ajv()
const jsonwebtoken = require('jsonwebtoken');
const conf = require('../../bin/config/config');
const bcrypt = require('bcrypt');


const login = () => {
  return async (req, res) => {
    try {
      const user = await UserService.getByName(req.body.name)
      if(!user) {
          res.status(200).json({ message: 'Auth failed. No user found', type: 'name', success: false});
      } else {
        bcrypt.compare(req.body.password, user.hashPassword, (err, result) => {
          if(!result) {
            res.status(200).json({ message: 'Auth failed. Wrong password', type: 'password', success: false})
          } else {
            const token = jsonwebtoken.sign({email: user.email, name: user.name, _id: user._id}, conf.costJWT);
            return  res.status(200).cookie('accessToken', token, {maxAge: 360000, secure: false, httpOnly: true}).redirect('/');
          }  
        });
      }
    } catch (error) {
      res.status(400).json({ message: error})
    } 
  }
}

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const data = {name: req.body.name, password: req.body.password}
      const valid = ajv.validate(schema, data)
      if (!valid) {
        res.status(401).send('no valid');
      } 
      if(valid) {
        if(req.body.name == '' || req.body.password == '') {
          res.status(200).json({ message: 'Enter name and password', type: 'valid', success: false});
        } else {
          next();
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

router.route('/')
  .get( async (req, res, next) => {
    res.render('login', {title: 'Express'});
  })
  .post( validate(validatorUserSchema.userSchema), login())

module.exports = router;