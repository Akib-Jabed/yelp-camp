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

            expect(mockQuery.sort).toHaveBeenCalledWith("price -rating")
        })

        it('should use default sorting when no sorting field provided', () => {
            const testQueryString = {
                title: 'campground',
                location: 'location'
            }
            const apiFeatures = new ApiFeatures(mockQuery, testQueryString)
            const result = apiFeatures.sort()

            expect(mockQuery.sort).toHaveBeenCalledWith("-createdAt")
        })
    })

    describe('paginate', () => {
        it('should paginate results with given page and limit', () => {
            const apiFeatures = new ApiFeatures(mockQuery, queryString)
            const result = apiFeatures.paginate()

            const skipValue = (queryString.page - 1) * queryString.limit;
            expect(mockQuery.skip).toHaveBeenCalledWith(skipValue);
            expect(mockQuery.limit).toHaveBeenCalledWith(queryString.limit);
        })

        it('should paginate results with default page(1) if value not given', () => {
            const testQueryString = {
                title: 'campground',
                location: 'location',
                sort: 'price,-rating',
                limit: 5 
            }
            const apiFeatures = new ApiFeatures(mockQuery, testQueryString)
            const result = apiFeatures.paginate()

            expect(mockQuery.skip).toHaveBeenCalledWith(0);
            expect(mockQuery.limit).toHaveBeenCalledWith(testQueryString.limit);
        })

        it('should paginate results with default limit(10) if value not given', () => {
            const testQueryString = {
                title: 'campground',
                location: 'location',
                sort: 'price,-rating',
                page: 2 
            }
            const apiFeatures = new ApiFeatures(mockQuery, testQueryString)
            const result = apiFeatures.paginate()

            const skipValue = (testQueryString.page - 1) * 10;
            expect(mockQuery.skip).toHaveBeenCalledWith(skipValue);
            expect(mockQuery.limit).toHaveBeenCalledWith(10);
        })

        

        it('should paginate results with default page(1) and limit(10) if value not given', () => {
            const testQueryString = {
                title: 'campground',
                location: 'location',
                sort: 'price,-rating'
            }
            const apiFeatures = new ApiFeatures(mockQuery, testQueryString)
            const result = apiFeatures.paginate()

            expect(mockQuery.skip).toHaveBeenCalledWith(0);
            expect(mockQuery.limit).toHaveBeenCalledWith(10);
        })
    })
})