const ApiError = require('../../src/utils/ApiError')

describe('ApiError', () => {
    it('should create an instance of Error', () => {
        const error = new ApiError(404, 'Not Found')

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ApiError)
    })

    it('should set status code, message and isOperational', () => {
        const testCases = [
            { statusCode: 400, message: 'Bad Request', isOperational: true },
            { statusCode: 401, message: 'Unauthorized', isOperational: true },
            { statusCode: 403, message: 'Forbidden', isOperational: true },
            { statusCode: 404, message: 'Not Found', isOperational: true },
            { statusCode: 500, message: 'Internal Server Error', isOperational: false },
        ]

        testCases.forEach(({statusCode, message, isOperational}) => { 
            const error = new ApiError(statusCode, message, isOperational)

            expect(error.statusCode).toBe(statusCode)
            expect(error.message).toBe(message)
            expect(error.isOperational).toBe(isOperational)
        })
    })

    it('should isOperational value is true', () => {
        const error = new ApiError(500, 'Internal Server Error')

        expect(error.statusCode).toBe(500)
        expect(error.message).toBe('Internal Server Error')
        expect(error.isOperational).toBe(true)
    })

    it('should capture stack trace', () => {
        const error = new ApiError(401, 'Unauthorized')

        expect(error.stack).toBeDefined()
        expect(typeof error.stack).toBe('string')
        expect(error.stack).toContain('ApiError')
        expect(error.stack).toContain('Unauthorized')
    })
})