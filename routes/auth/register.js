const express = require('express');
const UserService = require('../../services/UserService');
const router = express.Router();
const validatorUserSchema = require('../../models/validator/userSchema');
const Ajv = require("ajv")
const ajv = new Ajv()
const sendEmail = require('../../services/emailService');


const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const searchEmail = await UserService.getByEmail(req.body.email)
      const searchName = await UserService.getByName(req.body.name)
      const data = {name: req.body.name, email: req.body.email, password: req.body.password}
      const valid = ajv.validate(schema, data)
      if (!valid) {
        res.status(401).send('no valid')
        console.log(ajv.errors)
      } else if(searchEmail) {
        res.send('email used')
      } else if(searchName) {
        res.send('name used')
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }
}

const register = () =>{
  return async (req, res) => {
    try {
      const user = await UserService.create(req.body);
      user.hashPassword = undefined;
      const message = `lalalalala`;
      //await sendEmail(user.email, "Verify Email", message);
      return res.status(200).json({success: true});
    } catch (error) {
      return res.status(400).send({
        message: error,
        success: false
      })
    }
  }
}

router.route('/')
  .get(async (req, res, next) => {
    res.render('register', {title: 'Express' });
    console.log(await UserService.getAll())
  })
  .post(validate(validatorUserSchema.userSchema), register())

module.exports = router