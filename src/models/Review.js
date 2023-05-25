const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    body: String,
    rating: Number,
});

const ReviewModel = mongoose.model('Review', schema);

module.exports = ReviewModel;
