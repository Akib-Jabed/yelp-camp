const express = require('express');
const { checkLogin, verifyRole } = require('../middlewares/auth');
const { reviewController } = require('../controllers');
const validate = require('../middlewares/validate');
const { reviewValidation } = require('../validations');

const router = express.Router();

router.route('/').post(checkLogin, verifyRole('user'), validate(reviewValidation.review), reviewController.postReview);

module.exports = router;
