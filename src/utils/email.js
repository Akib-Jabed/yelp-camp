const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const config = require('../config/config');

aws.config.update(config.aws);

const transport = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01',
    }),
});

async function sendEmail(to, subject, body) {
    const message = {
        from: config.email.from,
        to,
        subject,
        html: body,
    };

    await transport.sendMail(message);
}

async function sendResetPasswordMail(to, token) {
    const subject = 'Reset password';
    // dummy link
    const resetPasswordUrl = `http://yelp-camp.com/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;

    await sendEmail(to, subject, text);
}

module.exports = {
    sendResetPasswordMail,
};
