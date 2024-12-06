/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
// eslint-disable-next-line no-unused-vars
const HttpStatusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
};

class APIError extends Error {
    constructor(name, httpCode, description, isOperational) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

function sendMailToAdminIfCritical() {}

function sendEventsToSentry() {}

class ErrorHandler {
    async handleError(err) {
        await this.logger.error(`Error message from the centralized error-handling component`, err);

        await sendMailToAdminIfCritical();
        await sendEventsToSentry();
    }

    isTrustedError(err) {
        if (err instanceof APIError) {
            return err.isOperational;
        }
        return false;
    }
}

export const errorHandler = new ErrorHandler();

const winston = require('winston');

const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
    },
};

const formatter = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info;

        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
    })
);

function isDevEnvironment() {
    return true;
}

class Logger {
    constructor() {
        this.logger = winston.Logger;

        const prodTransport = new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        });
        const transport = new winston.transports.Console({
            format: formatter,
        });

        this.logger = winston.createLogger({
            level: isDevEnvironment() ? 'trace' : 'error',
            levels: customLevels.levels,
            transports: [isDevEnvironment() ? transport : prodTransport],
        });
        winston.addColors(customLevels.colors);
    }

    trace(message, meta) {
        this.logger.log('trace', message, meta);
    }

    debug(message, meta) {
        this.logger.debug(message, meta);
    }

    info(message, meta) {
        this.logger.info(message, meta);
    }

    warn(message, meta) {
        this.logger.warn(message, meta);
    }

    error(message, meta) {
        this.logger.error(message, meta);
    }

    fatal(message, meta) {
        this.logger.log('fatal', message, meta);
    }
}

export const logger = new Logger();

process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});

process.on('uncaughtException', (error) => {
    errorHandler.handleError(error);
    if (!errorHandler.isTrustedError(error)) {
        process.exit(1);
    }
});
