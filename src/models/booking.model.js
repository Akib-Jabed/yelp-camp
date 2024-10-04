const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
    {
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Booking must belong to a tour'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Booking must belong to a user'],
        },
        amount: {
            type: Number,
            required: [true, 'Booking amount required'],
        },
    },
    {
        timestamps: true,
    }
);

schema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'title',
    });

    next();
});

const Booking = mongoose.model('Booking', schema);

module.exports = Booking;
