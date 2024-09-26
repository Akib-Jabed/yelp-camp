/* eslint-disable func-names */
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
        role: {
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

// schema.methods.createPasswordResetToken = function () {
//     const resetToken = crypto.randomBytes(32).toString('hex');

//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     this.passwordResetExpired = Date.now() + 10 * 60 * 1000;

//     return resetToken;
// };

const Token = mongoose.model('Token', schema);

module.exports = Token;
