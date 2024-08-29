const express = require('express');
const { userController } = require('../controllers');
const { userValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

router.route('/').post(validate(userValidation.createUser), userController.createUser);

module.exports = router;
