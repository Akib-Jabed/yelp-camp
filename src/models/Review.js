const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const ReviewModel = mongoose.model('Review', schema);

module.exports = ReviewModel;
