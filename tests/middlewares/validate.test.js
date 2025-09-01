const validate = require('../../src/middlewares/validate');
const ApiError = require('../../src/utils/ApiError');

jest.mock('../../src/utils/ApiError', () => {
    return jest.fn().mockImplementation((statusCode, message, isOperational=true) => {
        const error = new Error(message);
        error.statusCode = statusCode;
        error.isOperational = isOperational;
        return error;
    })
})

describe('validate middleware', () => {
    let mockSchema, mockReq, mockRes, mockNext;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        mockSchema = {
            validate: jest.fn()
        }
        mockReq = { body: { email: 'test@example.com' } }
        mockRes = {}
        mockNext = jest.fn()
    })
    
    it('should call next fucntion without error if validation succeeds', () => {
        mockSchema.validate.mockReturnValue({error: null})
        
        const middleware = validate(mockSchema);
        middleware(mockReq, mockRes, mockNext);
        
        expect(mockSchema.validate).toHaveBeenCalledWith(mockReq.body, { 
            abortEarly: false, 
            allowUnknown: true 
        })
        expect(typeof mockReq.body).toBe('object')
        expect(mockNext).toHaveBeenCalledWith()
        expect(mockNext).toHaveBeenCalledTimes(1)
        expect(mockNext).not.toHaveBeenCalledWith(expect.any(Error))
        expect(ApiError).not.toHaveBeenCalled()
    })
    
    it('should call next function with error if validation failed', () => {
        const mockError = {
            details: [
                { message: "password is required" }
            ]
        }
        mockSchema.validate.mockReturnValue({error: mockError})
        
        
        const middleware = validate(mockSchema)
        middleware(mockReq, mockRes, mockNext)
        
        expect(mockSchema.validate).toHaveBeenCalledWith(
            { email: 'test@example.com' }, 
            { abortEarly: false, allowUnknown: true }
        )
        expect(ApiError).toHaveBeenCalledWith(400, "password is required");
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error))
        expect(mockNext).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple validation errors', () => {
        const mockError = {
            details: [
                { message: "password is required" },
                { message: "age is required" }
            ]
        }
        mockSchema.validate.mockReturnValue({error: mockError})
        
        
        const middleware = validate(mockSchema)
        middleware(mockReq, mockRes, mockNext)
        
        expect(ApiError).toHaveBeenCalledWith(400, "password is required, age is required");
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error))
        expect(mockNext).toHaveBeenCalledTimes(1)
    })

    it('should handle empty request body object', () => {
        mockReq.body = {}
        mockSchema.validate.mockReturnValue({error: null})
        
        const middleware = validate(mockSchema)
        middleware(mockReq, mockRes, mockNext)
        
        expect(mockSchema.validate).toHaveBeenCalledWith({}, { 
            abortEarly: false, 
            allowUnknown: true 
        })
        expect(mockNext).toHaveBeenCalledWith()
    })
})