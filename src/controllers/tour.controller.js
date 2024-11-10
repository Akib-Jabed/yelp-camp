const { Tour } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const getTours = catchAsync(async (req, res) => {
    const tours = await Tour.find({});
    res.status(200).send({ data: tours });
});

const createTour = catchAsync(async (req, res) => {
    const tour = new Tour(req.body);
    tour.images = req.files.map((file) => file.filename);
    tour.user = req.user.id;
    await tour.save();

    res.status(201).send(tour);
});

const updateTour = catchAsync(async (req, res) => {
    const { slug } = req.params;
    const tour = await Tour.findOneAndUpdate({ slug }, { ...req.body });
    if (!tour) {
        throw new ApiError(404, 'Tour not found');
    }
    tour.images.push(...req.files.map((file) => file.filename));
    await tour.save();

    res.status(200).send(tour);
});

const deleteTour = catchAsync(async (req, res) => {
    const { slug } = req.params;
    const tour = await Tour.findOneAndUpdate({ slug }, { active: false });
    if (!tour) {
        throw new ApiError(404, 'Tour not found');
    }
    res.status(200).send(tour);
});

const getTour = catchAsync(async (req, res) => {
    const { slug } = req.params;
    const tour = await Tour.findOne({ slug });

    res.status(200).send(tour);
});

module.exports = {
    getTours,
    createTour,
    updateTour,
    deleteTour,
    getTour,
};
