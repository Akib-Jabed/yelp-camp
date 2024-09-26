const mongoose = require('mongoose');
const app = require('./src/app');
const config = require('./src/config/config');
const logger = require('./src/config/logger');

const server = app.listen(config.port, () => {
    mongoose.set('strictQuery', false);
    mongoose
        .connect(config.database.url)
        .then(() => logger.info('database connection successful'))
        .catch((err) => console.error(err));

    logger.info(`listening on port: ${config.port}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
        });
    }
    process.exit(1);
};

const unexpectedErrorHandler = (error) => {
    logger.info(error);
    exitHandler();
};

process.on('uncaughtException', () => {
    logger.info('UNCAUGHT EXCEPTION!! Shutting down...');
    unexpectedErrorHandler();
});
process.on('unhandledRejection', () => {
    logger.info('UNHANDLED REJECTION!! Shutting down...');
    unexpectedErrorHandler();
});
process.on('SIGTERM', () => {
    logger.info('SIGETRM received');
    exitHandler();
});
