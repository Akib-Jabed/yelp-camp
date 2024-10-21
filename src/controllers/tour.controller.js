const { Tour } = require('../models');
const catchAsync = require('../utils/catchAsync');

const getTours = catchAsync(async (req, res) => {
    const tours = await Tour.find({});
    res.status(201).send({ data: tours });
});

const createTour = catchAsync(async (req, res) => {
    const tour = new Tour(req.body);
    tour.images = req.files.map((file) => file.filename);
    tour.user = req.user.id;
    await tour.save();

    res.status(201).send(tour);
});

const updateTour = catchAsync(async (req, res) => {});

const deleteTour = catchAsync(async (req, res) => {});

const getTour = catchAsync(async (req, res) => {});

module.exports = {
    getTours,
    createTour,
    updateTour,
    deleteTour,
    getTour,
};
