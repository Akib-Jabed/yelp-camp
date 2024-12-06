const express = require('express');
const { authController } = require('../controllers');
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { checkLogin } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', checkLogin, authController.logout);
router.post('/update-password', checkLogin, validate(authValidation.updatePassword), authController.updatePassword);

module.exports = router;
