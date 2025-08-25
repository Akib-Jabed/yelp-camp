const ApiFeatures = require('../../src/utils/ApiFeatures');

describe('ApiFeatures', () => {
    let mockQuery;
    let queryString;

    beforeEach(() => {
        mockQuery = {
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
        }
    
        queryString = {
            title: 'campground',
            location: 'location',
            sort: 'price,-rating',
            page: 2,
            limit: 5 
        }
    })

    describe('filter', () => {
        it('should filter query by fields except excluded ones', () => {
            const apiFeatures = new ApiFeatures(mockQuery, queryString);
            const result = apiFeatures.filter();

            expect(result).toBe(apiFeatures)
            expect(result.query).toBe(mockQuery)
            expect(mockQuery.find).toHaveBeenCalledWith({
                title: { $regex: 'campground', $options: 'i' },
                location: { $regex: 'location', $options: 'i' },
            })
            expect(mockQuery.find).not.toHaveBeenCalledWith(
                expect.objectContaining({
                    sort: expect.anything(),
                    page: expect.anything(),
                    limit: expect.anything(),
                })
            )
        })

        it('should handle emty query string', () => {
            const testQueryString = {
                sort: 'price',
                page: 1,
                limit: 10
            }

            const apiFeatures = new ApiFeatures(mockQuery, testQueryString)
            apiFeatures.filter()

            expect(mockQuery.find).toHaveBeenCalledWith({})
        })
    })

    describe('sort', () => {
        it('should sort by given fields', () => {
            const apiFeatures = new ApiFeatures(mockQuery, queryString)
            const result = apiFeatures.sort()

            expect()
        })

        it('should use default sorting when no sorting field provided', () => {

        })
    })

    describe('paginate', () => {
        it('should paginate results with given page and limit', () => {

        })
    })
})