const mongoose = require('mongoose');
const tokenTypes = require('../config/tokens');

const { Schema } = mongoose;

const schema = new Schema(
    {
        token: {
            type: String,
            required: [true, 'Token is required'],
            index: true,
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: [tokenTypes.ACCESS, tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
            required: true,
        },
        expires: {
            type: Date,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

schema.pre(/^find/, function (next) {
    this.find({ blacklisted: { $ne: false } });
    next();
});

const Token = mongoose.model('Token', schema);

module.exports = Token;
