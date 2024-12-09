const catchAsync = require('../utils/catchAsync');
const { campgroundService } = require('../services');

const getCampgrounds = catchAsync(async (req, res) => {
    const campgrounds = await campgroundService.getCampgrounds();

    res.status(200).send({ data: campgrounds });
});

const createCampground = catchAsync(async (req, res) => {
    const campground = await campgroundService.createCampground(req);

    res.status(201).send(campground);
});

const updateCampground = catchAsync(async (req, res) => {
    const campground = await campgroundService.updateCampground(req);

    res.status(200).send(campground);
});

const deleteCampground = catchAsync(async (req, res) => {
    const campground = await campgroundService.deleteCampground(req);

    res.status(200).send(campground);
});

const getCampground = catchAsync(async (req, res) => {
    const campground = await campgroundService.getCampground(req.params);

    res.status(200).send(campground);
});

module.exports = {
    getCampgrounds,
    createCampground,
    updateCampground,
    deleteCampground,
    getCampground,
};
