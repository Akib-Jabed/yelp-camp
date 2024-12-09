const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            unique: [true, 'Title already taken'],
            trim: true,
            maxlength: [30, "Title can't be more than 30 characters"],
            minlength: [3, 'Title must be atleast 3 characters long'],
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Description is required'],
        },
        location: {
            type: String,
            trim: true,
            required: [true, 'Location is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
        },
        images: [String],
        active: {
            type: Boolean,
            default: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Campground must belong to a user'],
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

schema.index({ price: 1 });

schema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'campground',
    localField: '_id',
});

schema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name, email, photo',
    }).populate('reviews');
    next();
});

schema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

const Campground = mongoose.model('Campground', schema);

module.exports = Campground;
