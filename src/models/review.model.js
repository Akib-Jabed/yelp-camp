const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Review must have a title'],
            trim: true,
            maxlength: [30, "Title can't be more than 30 characters"],
            minlength: [3, 'Title must be atleast 3 characters long'],
        },
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
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour'],
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

schema.index({ tour: 1, user: 1 }, { unique: true });

schema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName, lastName, photo',
    });

    next();
});

const Review = mongoose.model('Review', schema);

module.exports = Review;
