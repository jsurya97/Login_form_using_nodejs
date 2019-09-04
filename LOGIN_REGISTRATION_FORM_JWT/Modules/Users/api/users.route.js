var express = require('express')
var router = express.Router()
var UserController = require('../users.controller');
var Authorization = require('D:/LOGIN_REGISTRATION_FORM_JWT/auth/authorization');
var UserServicee = require('../user.service');

// Authorize each API with middleware and map to the Controller Functions
router.get('/', UserController.getIndex);
router.post('/register', UserServicee.upload.single('wallpaper'), UserController.createUser)
router.get('/login', UserController.getLogin);
router.get('/register', UserController.getRegister);
router.post('/login', UserController.loginUser)
router.get('/list/:page', Authorization, UserController.getUsers)
router.post('/search', UserController.getUserBySearch)
router.get('/register/:_id', UserController.updateUser)
router.get('/delete/:id', UserController.removeUser)

// Export the Router
module.exports = router;