const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
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
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Campground must belong to a user'],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

schema.index({ price: 1 });

schema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'campground',
    localField: '_id',
});

schema.statics.isTitleTaken = async function (title, excludeCampgroundId) {
    const campground = await this.findOne({ title, _id: { $ne: excludeCampgroundId } });
    return !!campground;
};

const Campground = mongoose.model('Campground', schema);

module.exports = Campground;
