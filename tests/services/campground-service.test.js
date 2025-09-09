const { createCampground, getCampground, getCampgrounds, updateCampground, deleteCampground } = require('../../src/services/campground.service');
const { Campground, Review } = require('../../src/models');
const ApiError = require('../../src/utils/ApiError');
const ApiFeatures = require('../../src/utils/ApiFeatures');

jest.mock('../../src/models');
jest.mock('../../src/utils/ApiError', () => {
    return jest.fn().mockImplementation((statusCode, message) => {
        const error = new Error(message)
        error.statusCode = statusCode
        return error;
    })
})
jest.mock('../../src/utils/ApiFeatures')

describe('campground service', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    describe('get campgrounds', () => {
        const mockCampgrounds = [];
        const mockReq = {
            query: {
                sort: '-price',
                page: 1,
                limit: 5,
                title: 'campground'
            }
        }
        const mockApiFeatures = {
            filter: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            paginate: jest.fn().mockReturnThis(),
            query: Promise.resolve(mockCampgrounds)
        };
        
        ApiFeatures.mockImplementation(() => mockApiFeatures);
        
        it('should return campgrounds with features', async () => {
            const result = await getCampgrounds(mockReq);
            
            expect(ApiFeatures).toHaveBeenCalledWith(Campground.find({}), mockReq.query)
            expect(Campground.find).toHaveBeenCalledWith({})
            expect(mockApiFeatures.filter).toHaveBeenCalled()
            expect(mockApiFeatures.sort).toHaveBeenCalled()
            expect(mockApiFeatures.paginate).toHaveBeenCalled()
            expect(result).toBe(mockCampgrounds)
        })
    })
})