const { format, transports, createLogger } = require('winston');

const { combine, timestamp, json } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss A',
        }),
        json()
    ),
    transports: [new transports.Console(), new transports.File({ filename: 'logs/app.log' })],
});

module.exports = logger;
