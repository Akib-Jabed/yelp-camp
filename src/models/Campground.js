const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
});

const CampgroundModel = mongoose.model('Campground', schema);

module.exports = CampgroundModel;
