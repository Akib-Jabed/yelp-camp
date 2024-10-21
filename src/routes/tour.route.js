const express = require('express');
const { checkLogin, verifyRole } = require('../middlewares/auth');
const { tourController } = require('../controllers');
const validate = require('../middlewares/validate');
const { tourValidation } = require('../validations');
const { uploader, generateThumb } = require('../middlewares/fileUploader');

const router = express.Router();
const upload = uploader();

router
    .route('/')
    .get(tourController.getTours)
    .post(
        checkLogin,
        verifyRole('admin'),
        upload.array('images'),
        generateThumb,
        validate(tourValidation.createTour),
        tourController.createTour
    );

module.exports = router;
