const express = require('express');
const { checkLogin } = require('../middlewares/auth');
const { campgroundController } = require('../controllers');
const validate = require('../middlewares/validate');
const { campgroundValidation } = require('../validations');
const { uploader, generateThumb } = require('../middlewares/fileUploader');

const router = express.Router();
const upload = uploader();

router
    .route('/')
    .get(campgroundController.getCampgrounds)
    .post(
        checkLogin,
        upload.array('images'),
        generateThumb,
        validate(campgroundValidation.campground),
        campgroundController.createCampground
    );

router
    .route('/:slug')
    .get(campgroundController.getCampground)
    .put(
        checkLogin,
        upload.array('images'),
        generateThumb,
        validate(campgroundValidation.campground),
        campgroundController.updateCampground
    )
    .delete(checkLogin, campgroundController.deleteCampground);

module.exports = router;
