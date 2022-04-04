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
          res.status(401).json({ message: 'Auth failed. No user found', success: false});
      } else {
        bcrypt.compare(req.body.password, user.hashPassword, (err, result) => {
          if(!result) {
            res.status(401).json({ message: 'Auth failed. Wrong password', success: false})
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
      const searchName = await UserService.getByName(req.body.name)
      const data = {name: req.body.name, password: req.body.password}
      const valid = ajv.validate(schema, data)
      if (!valid) {
        res.status(401).json({ message: 'enter name and password', success: false});
        //console.log(ajv.errors)
      } 
      if(valid) {
        next();
      }
    } catch (error) {
      next(error)
    }
  }
}

router.route('/')
  .get( async (req, res, next) => {
    res.render('login', {title: 'Express'});

    //res.clearCookie('foo');
    //await UserService.removeAll()
  })
  .post( validate(validatorUserSchema.userSchema), login())

module.exports = router;