const catchAsync = require('../utils/catchAsync');
const { campgroundService } = require('../services');

const getCampgrounds = catchAsync(async (req, res) => {
    const [campgrounds, totalCount] = await campgroundService.getCampgrounds(req);

    res.status(200).send({ success: true, data: campgrounds, count: totalCount });
});

const createCampground = catchAsync(async (req, res) => {
    const requestObj = {
        body: { ...req.body },
        files: req.cloudinaryResults,
        userId: req.user.id
    }
    const campground = await campgroundService.createCampground(requestObj);
    res.status(201).send({ success: true, data: campground });
});

const updateCampground = catchAsync(async (req, res) => {
    const requestObj = {
        campgroundId: req.params.campgroundId,
        body: { ...req.body },
        files: req.cloudinaryResults,
        userId: req.user.id
    }
    const campground = await campgroundService.updateCampground(requestObj);
    console.log('campground', campground);
    res.status(200).send({ success: true, data: campground });
});

const deleteCampground = catchAsync(async (req, res) => {
    await campgroundService.deleteCampground(req);

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
