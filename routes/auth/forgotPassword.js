const express = require('express');
const router = express.Router();
const UserService = require('../../services/UserService');

const registerRouter = require('./register');

router.route('/')
  .get((req, res, next) => {
    res.render('forgotPassword', {title: 'Express' });
  })
  .post((req, res, next) => {
    const email = req.body.email;
    //const existingUser = await UserService.getByEmail(email);
    try {
      // send email 
    } catch (error) {
      console.log(error)
    }
  })

module.exports = router;
