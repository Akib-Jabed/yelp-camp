const jwt = require('jsonwebtoken')
const ApiError = require('../../src/utils/ApiError')
const {checkLogin} = require('../../src/middlewares/auth')
const config = require('../../src/config/config')

jest.mock('jsonwebtoken')
jest.mock('../../src/utils/ApiError', () => {
    return jest.fn().mockImplementation((statusCode, message, isOperational=true) => {
        const error = new Error(message)
        error.statusCode = statusCode;
        error.isOperational = isOperational;
        return error;
    })
})
jest.mock('../../src/config/config', () => ({
    jwt: {
        secret: 'test-secret-key'
    }
}))
jest.mock('../../src/utils/catchAsync', () => {
    return jest.fn().mockImplementation(fn => fn)
})

describe('auth middleware', () => {
    let mockReq, mockRes, mockNext, mockDecoded;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        mockReq = { headers: {} }
        mockRes = {}
        mockNext = jest.fn()
        
        mockDecoded = {
            data: {
                id: '123',
                username: 'user123',
                email: 'user@example.com'
            }
        }
    })
    
    it('should throw 401 if authorization header is missing', () => {
        const testCases = [
            { headers: {} },
            { headers: { authorization: '' } }
        ]
        
        testCases.forEach(async (testCase) => {
            mockReq.headers = testCase.headers
            
            await expect(checkLogin(mockReq, mockRes, mockNext)).rejects.toThrow('Please log in to get access')
            expect(ApiError).toHaveBeenCalledWith(401, 'Please log in to get access')
            expect(jwt.verify).not.toHaveBeenCalled()
        })
    })
    
    it('should throw 401 if token is missing', () => {
        const testCases = [
            { authorization: '' },
            { authorization: 'Bearer ' }
        ]

        testCases.forEach(async (testCase) => {
            mockReq.headers.authorization = testCase.authorization
            
            await expect(checkLogin(mockReq, mockRes, mockNext)).rejects.toThrow('Please log in to get access')
            expect(ApiError).toHaveBeenCalledWith(401, 'Please log in to get access')
            expect(jwt.verify).not.toHaveBeenCalled()
        })
    })
    
    it('should throw 403 if token verification failed', async () => {
        mockReq.headers.authorization = 'Bearer mockToken';
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error, null)
        })
        
        await expect(checkLogin(mockReq, mockRes, mockNext)).rejects.toThrow('Authorization failed')
        expect(ApiError).toHaveBeenCalledWith(403, 'Authorization failed')
        expect(jwt.verify).toHaveBeenCalledWith('mockToken', config.jwt.secret, expect.any(Function))
        expect(mockNext).not.toHaveBeenCalled()
    })
    
    it('should decode user data from token and set to req on if token verified successfully', async () => {
        mockReq.headers.authorization = 'Bearer mockToken';
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockDecoded)
        })
        jwt.decode.mockReturnValue(mockDecoded);
        
        await checkLogin(mockReq, mockRes, mockNext);
        
        expect(jwt.verify).toHaveBeenCalledWith('mockToken', config.jwt.secret, expect.any(Function))
        expect(jwt.decode).toHaveBeenCalledWith('mockToken')
        expect(mockReq.user).toEqual(mockDecoded.data)
        expect(mockReq.user.id).toBe('123')
        expect(mockReq.user.username).toBe('user123')
        expect(mockReq.user.email).toBe('user@example.com')
        expect(ApiError).not.toHaveBeenCalled()
        expect(mockNext).toHaveBeenCalled()
        expect(mockNext).toHaveBeenCalledTimes(1)
    })
})