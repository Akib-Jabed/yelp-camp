const express = require('express');
const { userController } = require('../controllers');
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

router.route('/').get(userController.getUsers);
// .post(validate(userValidation.createUser), userController.createUser);

module.exports = router;
