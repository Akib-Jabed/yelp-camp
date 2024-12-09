const express = require('express');
const { checkLogin } = require('../middlewares/auth');
const { reviewController } = require('../controllers');
const validate = require('../middlewares/validate');
const { reviewValidation } = require('../validations');

const router = express.Router();

router.route('/').post(checkLogin, validate(reviewValidation.review), reviewController.postReview);

router
    .route('/:reviewId')
    .put(checkLogin, validate(reviewValidation.review), reviewController.updateReview)
    .delete(checkLogin, reviewController.deleteReview);

module.exports = router;
