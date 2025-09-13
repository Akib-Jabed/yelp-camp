const { postReview } = require('../../src/controllers/review.controller')
const { reviewService } = require('../../src/services');

jest.mock('../../src/services')

describe('review controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            body: {
                body: 'Greate campground!',
                rating: 5
            },
            params: {
                campgroundId: 'campground1',
            },
            user: {
                id: 'user1'
            }
        }
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
    })

    it('should create review and return 201 with new review', async () => {
        const mockReview = {
            id: 'review123',
            ...mockReq.body,
            campground: mockReq.params.campgroundId,
            user: mockReq.user.id,
            createdAt: '1234567890'
        };

        reviewService.createReview.mockResolvedValue(mockReview)
        await postReview(mockReq, mockRes)

        expect(reviewService.createReview).toHaveBeenCalledWith(mockReq)
        expect(mockRes.status).toHaveBeenCalledWith(201)
        expect(mockRes.send).toHaveBeenCalledWith(mockReview)
    })
})