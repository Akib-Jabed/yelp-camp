const { Booking, Tour } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const getBookings = catchAsync(async (req, res) => {
    const bookings = await Booking.find({});
    res.status(200).send({ data: bookings });
});

const submitBooking = catchAsync(async (req, res) => {
    const { tour } = req.body;

    const validTour = await Tour.findById(tour);
    if (!validTour) {
        throw new ApiError(400, 'Booking is not possible for this tour');
    }

    const booking = new Booking(req.body);
    booking.user = req.user.id;
    await booking.save();

    res.status(201).send(booking);
});

module.exports = {
    getBookings,
    submitBooking,
};
