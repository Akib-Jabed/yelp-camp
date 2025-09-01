const { createReview } = require('../../src/services/review.service')
const { Review, Campground } = require('../../src/models');
const ApiError = require('../../src/utils/ApiError');

jest.mock('../../src/models', () => ({
    Campground: {
        findById: jest.fn()
    },
    Review: jest.fn().mockImplementation((data) => {
        const instance = {
            ...data,
            save: jest.fn().mockResolvedValue()
        };
        return instance;
    })
}))

jest.mock('../../src/utils/ApiError', () => {
    return jest.fn().mockImplementation((statusCode, message, isOperational=true) => {
        const error = new Error(message);
        error.statusCode = statusCode;
        error.isOperational = isOperational;
        return error;
    })
})

describe('Review Service', () => {
    let mockReq;

    beforeEach(() => {
        jest.clearAllMocks()

        mockReq = {
            originalUrl: "/api/campgrounds/123/reviews",
            body: { body: "Great place!", rating: 5 },
            user: { id: "user123" }
        }
    })

    describe('create review', () => {
        it('should throw api error if campground not found', async () => {
            Campground.findById.mockResolvedValue(null);

            await expect(createReview(mockReq)).rejects.toThrow('Campground not found')
            await expect(createReview(mockReq)).rejects.toMatchObject({
                statusCode: 404,
                message: 'Campground not found'
            })
            expect(Campground.findById).toHaveBeenCalledWith("123")
            expect(ApiError).toHaveBeenCalledWith(404, 'Campground not found')
        })

        it('should create and save review if campground exists', async () => {
            const mockCampground = { _id: "123", name: "Test campground" }
            
            Campground.findById.mockResolvedValue(mockCampground);
            const result = await createReview(mockReq);

            expect(Campground.findById).toHaveBeenCalledWith('123')
            expect(Review).toHaveBeenCalledWith(mockReq.body)
            expect(result.campground).toBe('123')
            expect(result.user).toBe('user123')
            expect(result.rating).toBe(5)
            expect(result.save).toHaveBeenCalled()
        })
    })
})