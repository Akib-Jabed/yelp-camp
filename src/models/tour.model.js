const mongoose = require('mongoose');
const slugify = require('slugify');

const { Schema } = mongoose;

const schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Tour must have a title'],
            unique: true,
            trim: true,
            maxlength: [30, "Title can't be more than 30 characters"],
            minlength: [3, 'Title must be atleast 3 characters long'],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'Tour must have a duration'],
        },
        groupSize: {
            type: Number,
            required: [true, 'Tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'Tour must have a difficulty level'],
            enum: {
                values: ['easy', 'normal', 'difficult'],
                message: 'Srt difficulty level between easy, normal and difficult',
            },
        },
        price: {
            type: Number,
            required: [true, 'Tour must have a price'],
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Tour must have a description'],
        },
        location: {
            type: String,
            trim: true,
            required: [true, 'Tour must have a location'],
        },
        images: [String],
        active: {
            type: Boolean,
            default: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Tour must belong to a user'],
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

schema.index({ slug: 1 });
schema.index({ price: 1 });

schema.virtuals('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

schema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

schema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

const Tour = mongoose.model('Tour', schema);

module.exports = Tour;
