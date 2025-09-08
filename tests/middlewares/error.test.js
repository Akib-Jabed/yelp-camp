const { errorConverter } = require('../../src/middlewares/error');
const mongoose = require('mongoose');
const ApiError = require('../../src/utils/ApiError');

jest.mock('mongoose')
jest.mock('../../src/utils/ApiError')

describe('error middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = {}
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        mockNext = jest.fn()
    })

    describe('error converter', () => {
        it('should pass through ApiError without modification', () => {
            const apiError = new ApiError(404, 'Not found');
            jest.clearAllMocks();

            errorConverter(apiError, mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(apiError);
            expect(ApiError).not.toHaveBeenCalled();
        })

        it('should convert non-apiError with default values', () => {
            const err = new Error('Unknown error');
            errorConverter(err, mockReq, mockRes, mockNext);
            
            expect(ApiError).toHaveBeenCalledWith(expect.any(Number), 'Unknown error', false);
            expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError))
        })

        it('should set statusCode=400 if error is mongoose error', () => {
            const err = new mongoose.Error();
            err.message = 'Mongoose error';
            errorConverter(err, mockReq, mockRes, mockNext);
            
            expect(ApiError).toHaveBeenCalledWith(400, 'Mongoose error', false);
            expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError))
        })

        it('should handle errors without message', () => {
            const err = {}
            errorConverter(err, mockReq, mockRes, mockNext);

            expect(ApiError).toHaveBeenCalledWith(500, 'Something went wrong', false);
            expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError))
        })
    })
})