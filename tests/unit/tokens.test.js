const jwt = require('jsonwebtoken');
const config = require('../../src/config/config')
const { generateToken } = require('../../src/utils/tokens');

jest.mock('../../src/config/config', () => ({
    jwt: {
        expires: 3600,
        secret: 'default-test-secret'
    },
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}))

describe('token generation', () => {
    const mockUser = {
        id: 123,
        username: 'test-user',
        email: 'test-user@email.com',
    };
    
    const mockToken = 'mock.jwt.token'
    
    beforeEach(() => {
        jest.clearAllMocks();
        jwt.sign.mockReturnValue(mockToken)
    })
    
    describe('with default parameters', () => {
        it('should generate a token with default expires and secret', () => {
            const result = generateToken(mockUser)
            
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    data: {
                        id: mockUser.id,
                        username: mockUser.username,
                        email: mockUser.email,
                    }
                },
                config.jwt.secret,
                { expiresIn: config.jwt.expires }
            )
            expect(result).toBe(mockToken)
        })
        
        it('should only include id, username and email in the payload', () => {
            const user = {
                id: 123,
                name: 'Test User',
                username: 'test-user',
                email: 'test-user@email.com',
                password: 'secret123',
                role: 'admin'
            }
            
            generateToken(user)
            const expectedPayload = {
                data: {
                    id: 123,
                    username: 'test-user',
                    email: 'test-user@email.com',
                }
            }
            
            expect(jwt.sign).toHaveBeenCalledWith(
                expectedPayload,
                config.jwt.secret,
                { expiresIn: config.jwt.expires }
            )
        })
    })
    
    describe('with custom parameters', () => {
        it('should generate a token with custom expires', () => {
            const customExpires = 2 * 3600;
            generateToken(mockUser, customExpires)

            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    data: {
                        id: mockUser.id,
                        username: mockUser.username,
                        email: mockUser.email
                    }
                },
                config.jwt.secret,
                { expiresIn: customExpires }
            )
        })

        it('should generate a token with custom secret', () => {
            const customSecret = 'custom-jwt-secret';
            generateToken(mockUser, undefined, customSecret)

            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    data: {
                        id: mockUser.id,
                        username: mockUser.username,
                        email: mockUser.email
                    }
                },
                customSecret,
                { expiresIn: config.jwt.expires }
            )
        })

        it('should generate a token with both custom secret and expires', () => {
            const customExpires = 2 * 3600;
            const customSecret = 'custom-jwt-secret';
            generateToken(mockUser, customExpires, customSecret)

            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    data: {
                        id: mockUser.id,
                        username: mockUser.username,
                        email: mockUser.email
                    }
                },
                customSecret,
                { expiresIn: customExpires }
            )
        })
    })

    describe('edge cases', () => {
        it('should handle expires as 0', () => {
            generateToken(mockUser, 0)

            expect(jwt.sign).toHaveBeenCalledWith(
                expect.any(Object),
                config.jwt.secret,
                { expiresIn: 0 }
            )
        })

        it('should handle empty secret', () => {
            generateToken(mockUser, undefined, '')

            expect(jwt.sign).toHaveBeenCalledWith(
                expect.any(Object),
                '',
                { expiresIn: config.jwt.expires }
            )
        })
    })

});
