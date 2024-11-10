const express = require('express');
const { checkLogin, verifyRole } = require('../middlewares/auth');
const { bookingController } = require('../controllers');
const { bookingValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

router
    .route('/')
    .get(checkLogin, verifyRole('admin'), bookingController.getBookings)
    .post(checkLogin, verifyRole('user'), validate(bookingValidation.booking), bookingController.submitBooking);

module.exports = router;
