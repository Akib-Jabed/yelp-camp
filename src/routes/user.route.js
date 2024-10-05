const express = require('express');
const { userController } = require('../controllers');
const { checkLogin, verifyRole } = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(checkLogin, verifyRole('admin'), userController.getUsers);

module.exports = router;
