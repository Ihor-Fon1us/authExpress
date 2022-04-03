const express = require('express');
const router = express.Router();
const UserService = require('../../services/UserService');
const validatorUserSchema = require('../../models/validator/userSchema');
const Ajv = require("ajv")
const ajv = new Ajv()
const jsonwebtoken = require('jsonwebtoken');
const conf = require('../../bin/config/config');


const login = () => {
  return async (req, res) => {
    try {
      const user = await UserService.getByName(req.body.name)
      if(!user) {
          res.status(401).json({ message: 'Auth failed. No user found'});
      } else if(user) {
          if(!user.comparePassword(req.body.password, user.hashPassword)) {
              res.status(401).json({ message: 'Auth failed. Wrong password'})
          } else {
              const token = jsonwebtoken.sign({email: user.email, name: user.name, _id: user._id}, conf.costJWT);
              return  res.cookie('accessToken', token, {maxAge: 360000, secure: false, httpOnly: true}).redirect('/')
          }
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
        res.status(401).json({ message: 'no valid'});
        console.log(ajv.errors)
      } else if(!req.body.password) {
        res.status(401).json({ message: 'write password'})
        console.log(ajv.errors)
      }  else {
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