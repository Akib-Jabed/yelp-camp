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
        validate(tourValidation.tour),
        tourController.createTour
    );

router
    .route('/:slug')
    .get(tourController.getTour)
    .put(
        checkLogin,
        verifyRole('admin'),
        upload.array('images'),
        generateThumb,
        validate(tourValidation.tour),
        tourController.updateTour
    )
    .delete(checkLogin, verifyRole('admin'), tourController.deleteTour);

module.exports = router;
