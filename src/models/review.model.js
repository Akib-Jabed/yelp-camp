const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
    {
        body: {
            type: String,
            required: [true, "Review body can't be empty"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        campground: {
            type: mongoose.Schema.ObjectId,
            ref: 'Campground',
            required: [true, 'Review must belong to a campground'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
    {
        timestamps: true,
    }
);

schema.index({ campground: 1, user: 1 }, { unique: true });

schema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email photo',
    });

    next();
});

const Review = mongoose.model('Review', schema);

module.exports = Review;
