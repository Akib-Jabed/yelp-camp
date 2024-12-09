const mongoose = require('mongoose');
const slugify = require('slugify');

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
        slug: String,
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
        author: {
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

schema.index({ slug: 1 });
schema.index({ price: 1 });

schema.virtual('reviews', {
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

const Campground = mongoose.model('Campground', schema);

module.exports = Campground;
