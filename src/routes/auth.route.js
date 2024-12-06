const express = require('express');
const { authController } = require('../controllers');
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { checkLogin } = require('../middlewares/auth');

const router = express.Router();

// validate(authValidation.register),
router.post('/register', authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', checkLogin, authController.logout);
router.post('/update-password', checkLogin, validate(authValidation.updatePassword), authController.resetPassword);

module.exports = router;
