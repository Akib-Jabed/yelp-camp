const express = require('express');

const app = express();

// Error-handling middleware -> Centralize Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Custom Error Class -> Advanced techniques
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

try {
    throw new APIError('Custom error message', 400);
} catch (err) {
    if (err instanceof APIError) {
        console.error(`API Error: ${err.message} (status: ${err.statusCode})`);
    } else {
        console.error(`An unexpected error occurred: ${err}`);
    }
}

const winston = require('winston');

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: 'error.log' })],
});

try {
    throw new Error('Something Went Wrong!');
} catch (err) {
    logger.error(err.message, { stack: err.stack });
}

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Perform cleanup and exit process if necessary
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Perform cleanup and exit process if necessary
});

app.listen(3000, () => {
    console.log(`Server is running on port: 3000`);
});
