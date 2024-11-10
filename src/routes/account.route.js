const express = require('express');
const { accountController } = require('../controllers');
const { checkLogin, verifyRole } = require('../middlewares/auth');
const { accountValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

router
    .get('/', checkLogin, accountController.getAccountInfo)
    .put('/', checkLogin, verifyRole('user'), validate(accountValidation.account), accountController.updateAccountInfo);

router.put('/deactivate', checkLogin, verifyRole('user'), accountController.deactivateAccount);

router.put(
    '/update-password',
    checkLogin,
    verifyRole('user'),
    validate(accountValidation.updatePassword),
    accountController.updatePassword
);

module.exports = router;
