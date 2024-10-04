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
            required: true,
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

const Token = mongoose.model('Token', schema);

module.exports = Token;
