const mongoose = require('mongoose');
const ReviewModel = require('./Review');

const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    latitude: String,
    longitude: String,
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
});

schema.post('findOneAndDelete', async (data) => {
    if (data) {
        await ReviewModel.deleteMany({
            _id: { $in: data.reviews },
        });
    }
});

const CampgroundModel = mongoose.model('Campground', schema);

module.exports = CampgroundModel;
