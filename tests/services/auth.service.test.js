const { registerUser, loginUser } = require('../../src/services/auth.service')
const { User } = require('../../src/models')
const ApiError = require('../../src/utils/ApiError')

jest.mock('../../src/models', () => ({
    User: {
        isEmailTaken: jest.fn(),
        isUsernameTaken: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn()
    }
}))
jest.mock('../../src/utils/ApiError', () => {
    return jest.fn().mockImplementation((statusCode, message, isOperational=true) => {
        const error = new Error(message)
        error.statusCode = statusCode
        error.isOperational = isOperational
        return error
    })
})

describe('user service', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    describe('register user', () => {
        const userData = { 
            email: 'test@example.com', 
            username: 'testuser'
        }
        const newUserData = { 
            id: 'test1', 
            email: 'test@example.com', 
            username: 'testuser',
            password: 'testPassword',
            createdAt: 1234567890
        }
        
        it('should throw error if email already taken', async () => {
            User.isEmailTaken.mockResolvedValue(true)
            User.isUsernameTaken.mockResolvedValue(true)
            
            await expect(registerUser(userData)).rejects.toThrow('Email already taken')
            expect(User.isEmailTaken).toHaveBeenCalledWith('test@example.com')
            expect(ApiError).toHaveBeenCalledWith(409, 'Email already taken')
            expect(User.isUsernameTaken).not.toHaveBeenCalled()
            expect(User.create).not.toHaveBeenCalled()
        })
        
        it('should throw error if username already taken', async () => {
            User.isEmailTaken.mockResolvedValue(false)
            User.isUsernameTaken.mockResolvedValue(true)
            
            await expect(registerUser(userData)).rejects.toThrow('Username already taken')
            expect(User.isUsernameTaken).toHaveBeenCalledWith('testuser')
            expect(ApiError).toHaveBeenCalledWith(409, 'Username already taken')
            expect(User.create).not.toHaveBeenCalled()
        })
        
        it('should successfully register a new user', async () => {
            User.isEmailTaken.mockResolvedValue(false)
            User.isUsernameTaken.mockResolvedValue(false)
            User.create.mockResolvedValue(newUserData)
            
            const result = await registerUser(userData);
            
            expect(User.isEmailTaken).toHaveBeenCalledWith(userData.email)
            expect(User.isUsernameTaken).toHaveBeenCalledWith(userData.username)
            expect(User.create).toHaveBeenCalledWith(userData)
            expect(ApiError).not.toHaveBeenCalled()
            expect(result).toEqual({
                id: 'test1', 
                email: 'test@example.com', 
                username: 'testuser',
            })
        })
    })
    
    describe('login user', () => {
        const data = {
            email: 'test@example.com', 
            password: 'testPassword',
        }
        const userData = { 
            id: 'test1', 
            email: 'test@example.com', 
            username: 'testuser',
            password: 'testPassword',
            createdAt: 1234567890,
        }
        
        it('should throw error if user not found', async () => {
            User.findOne.mockResolvedValue(null);
            
            await expect(loginUser(data)).rejects.toThrow('Invalid credential')
            expect(ApiError).toHaveBeenCalledWith(403, 'Invalid credential')
            expect(User.findOne).toHaveBeenCalledWith({email: data.email})
        })
        
        it('should return error if password does not match', async () => {
            userData.isPasswordMatch = jest.fn().mockResolvedValue(false)
            User.findOne.mockResolvedValue(userData);
            await expect(loginUser(data)).rejects.toThrow('Invalid credential')
            expect(ApiError).toHaveBeenCalledWith(403, 'Invalid credential')
            expect(userData.isPasswordMatch).toHaveBeenCalledWith(data.password)
        })
        
        it('should login user for valid credentials', async () => {
            userData.isPasswordMatch = jest.fn().mockResolvedValue(true)
            User.findOne.mockResolvedValue(userData);
            
            const result = await loginUser(data);
            
            expect(ApiError).not.toHaveBeenCalled()
            expect(result).toEqual({
                id: 'test1', 
                email: 'test@example.com', 
                username: 'testuser'
            })
        })
    })
})