const express = require('express');
const { signUp, signIn, logout, findUser, getAllUser } = require('../controllers/userController');
const router = express.Router();
const validation = require('../Middlewares/validation');

router.route('/signup').post(validation.validateSignUp , signUp);

router.route('/signin').post(signIn);

router.route('/logout').post(logout);

router.route('/finduser/:id').get(findUser);

router.route('/getalluser').get(getAllUser);

module.exports = router;