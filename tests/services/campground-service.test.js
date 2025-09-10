const { createCampground, getCampground, getCampgrounds, updateCampground, deleteCampground, checkValidUser } = require('../../src/services/campground.service');
const { Campground, Review } = require('../../src/models');
const ApiError = require('../../src/utils/ApiError');
const ApiFeatures = require('../../src/utils/ApiFeatures');

jest.mock('../../src/models')
// , () => ({
//     Campground: {
//         isTitleTaken: jest.fn(),
//         find: jest.fn(),
//         findById: jest.fn(),
//         deleteOne: jest.fn(),
//     },
//     Review: {
//         deleteMany: jest.fn()
//     }
// }));
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

    describe('create campground', () => {
        const mockReq = {
            body: {
                title: 'Campground Title',
                description: 'Test campground description',
                location: 'Test location',
                price: 100
            },
            files: [
                { filename: 'image1.jpg' },
                { filename: 'image2.png' },
            ],
            user: {
                id: 'user1'
            }
        }
        const mockCampground = {
            ...mockReq.body,
            images: mockReq.files.map(file => file.filename),
            user: mockReq.user.id,
            save: jest.fn().mockResolvedValue(true)
        }

        it('should throw error for duplicate title', async () => {
            Campground.isTitleTaken.mockResolvedValue(true)

            await expect(createCampground(mockReq)).rejects.toThrow()
            expect(ApiError).toHaveBeenCalledWith(409, 'Title already taken')
        })

        it('should create a campground successfully', async () => {
            Campground.isTitleTaken.mockResolvedValue(false)
            Campground.mockImplementation(() => mockCampground)

            const result = await createCampground(mockReq)
            expect(Campground.isTitleTaken).toHaveBeenCalledWith('Campground Title')
            expect(Campground).toHaveBeenCalledWith(mockReq.body)
            expect(result.user).toBe('user1')
            expect(result.images).toEqual(['image1.jpg', 'image2.png'])
            expect(result).toBe(mockCampground)
            expect(mockCampground.save).toHaveBeenCalled()
        })

        it('should handle empty files array', async () => {
            Campground.isTitleTaken.mockResolvedValue(false)
            mockReq.files = []
            mockCampground.images = []
            Campground.mockImplementation(() => mockCampground)

            const result = await createCampground(mockReq)
            expect(Campground.isTitleTaken).toHaveBeenCalledWith('Campground Title')
            expect(Campground).toHaveBeenCalledWith(mockReq.body)
            expect(result.images).toEqual([])
            expect(result).toBe(mockCampground)
            expect(mockCampground.save).toHaveBeenCalled()
        })

        it('should handle campgrounds without files', async () => {
            Campground.isTitleTaken.mockResolvedValue(false)
            mockReq.files = undefined
            mockCampground.images = undefined
            Campground.mockImplementation(() => mockCampground)

            const result = await createCampground(mockReq)
            expect(Campground.isTitleTaken).toHaveBeenCalledWith('Campground Title')
            expect(Campground).toHaveBeenCalledWith(mockReq.body)
            expect(result.images).toBeUndefined()
            expect(result).toBe(mockCampground)
            expect(mockCampground.save).toHaveBeenCalled()
        })
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

    describe('get campground', () => {
        const mockReq = {
            params: {
                id: 1
            }
        }
        const mockCampground = {
            id: 1,
            title: 'Campground Title',
            description: 'Test campground description',
            location: 'Test location',
            price: 100,
            images: ['image1.jpg', 'image2.png'],
            user: 'user1',
        }
        beforeEach(() => {
            Campground.findById = jest.fn()
        })

        it('should get campground by id', async () => {
            Campground.findById.mockResolvedValue(mockCampground);
            const result = await getCampground(mockReq)

            expect(result).toBe(mockCampground)
            expect(Campground.findById).toHaveBeenCalledWith(1)
            expect(ApiError).not.toHaveBeenCalled()
        })

        it('should throw error if campground not found', async () => {
            Campground.findById.mockResolvedValue(null);

            await expect(getCampground(mockReq)).rejects.toThrow()
            expect(ApiError).toHaveBeenCalledWith(404, 'Campground not found')
        })
    })

    describe('check valid user', () => {
        it('should throw error for different user', () => {
            let campgroundUser = 1
            let loggedUser = 2

            expect(() => checkValidUser(campgroundUser, loggedUser)).toThrow();
            expect(ApiError).toHaveBeenCalledWith(403, "Don't have access to take this action")
        })

        it('should not throw error for same user', () => {
            let campgroundUser = 1
            let loggedUser = 1

            expect(() => checkValidUser(campgroundUser, loggedUser)).not.toThrow();
            expect(ApiError).not.toHaveBeenCalled()
        })
    })

    describe('update campground', () => {

    })

    describe('delete campground', () => {

    })
})