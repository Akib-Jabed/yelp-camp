const catchAsync = require('../utils/catchAsync');
const { campgroundService } = require('../services');
const ApiError = require('../utils/ApiError');

const getCampgrounds = catchAsync(async (req, res) => {
    const [campgrounds, totalCount] = await campgroundService.getCampgrounds(req);

    res.status(200).send({ success: true, data: campgrounds, count: totalCount });
});

const createCampground = catchAsync(async (req, res) => {
    if (req.cloudinaryResults === undefined) {
        throw new ApiError(400, 'Attach at least one image');
    }
    const requestObj = {
        body: { ...req.body },
        files: req.cloudinaryResults,
        userId: req.user.id
    }
    const campground = await campgroundService.createCampground(requestObj);
    res.status(201).send({ success: true, data: campground });
});

const updateCampground = catchAsync(async (req, res) => {
    const existingImages = JSON.parse(req.body.existingImages);
    if (req.cloudinaryResults === undefined && existingImages.length === 0) {
        throw new ApiError(400, 'Attach at least one image');
    }
    const requestObj = {
        campgroundId: req.params.campgroundId,
        body: { ...req.body },
        existingImages,
        files: req.cloudinaryResults,
        userId: req.user.id
    }
    const campground = await campgroundService.updateCampground(requestObj);
    res.status(200).send({ success: true, data: campground });
});

const deleteCampground = catchAsync(async (req, res) => {
    const requestObj = {
        campgroundId: req.params.campgroundId,
        userId: req.user.id
    }
    await campgroundService.deleteCampground(requestObj);

    res.status(204).send();
});

const getCampground = catchAsync(async (req, res) => {
    const campground = await campgroundService.getCampground(req.params.campgroundId);

    res.status(200).send({ success: true, data: campground });
});

module.exports = {
    getCampgrounds,
    createCampground,
    updateCampground,
    deleteCampground,
    getCampground,
};
