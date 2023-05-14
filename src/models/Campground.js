const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    latitude: String,
    longitude: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
});

const CampgroundModel = mongoose.model('Campground', schema);

module.exports = CampgroundModel;
