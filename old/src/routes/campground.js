const express = require('express');
const { catchAsync } = require('../utils/catchAsync');
const checkLogin = require('../middlewares/check-login');
const CampgroundController = require('../controllers/CampgroundController');
const fileUploader = require('../utils/fileUploader');
const { generateThumb } = require('../middlewares/generate-thumb');
const validateCampground = require('../validators/campground');
const { isCampgroundAuthor } = require('../middlewares/author');

const router = express.Router();
const upload = fileUploader.uploader();

router.get('/', catchAsync(CampgroundController.index));

router.get('/new', checkLogin, (req, res) => {
    res.render('campgrounds/new');
});

router.post(
    '/',
    checkLogin,
    upload.array('images'),
    generateThumb,
    validateCampground,
    catchAsync(CampgroundController.store)
);

router.get('/:id', catchAsync(CampgroundController.show));

router.get('/:id/edit', checkLogin, isCampgroundAuthor, catchAsync(CampgroundController.showEdit));

router.put(
    '/:id',
    checkLogin,
    upload.array('images'),
    generateThumb,
    validateCampground,
    catchAsync(CampgroundController.update)
);

router.delete('/:id', checkLogin, catchAsync(CampgroundController.delete));

module.exports = router;
