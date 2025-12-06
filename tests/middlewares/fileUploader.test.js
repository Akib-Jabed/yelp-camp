const { fileFilter, uploader } = require('../../src/middlewares/fileUploader')
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

jest.mock('multer')
jest.mock('sharp')
jest.mock('path')

describe('file uploader middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    describe('fileFilter', () => {
        const mockCallback = jest.fn();
        const validFiles = [
            { mimetype: 'image/png' },
            { mimetype: 'image/jpg' },
            { mimetype: 'image/jpeg' },
            { mimetype: 'image/gif' },
            { mimetype: 'image/bmp' },
            { mimetype: 'image/webp' },
            { mimetype: 'image/svg+xml' },
            { mimetype: 'image/svg' },
            { mimetype: 'image/tiff' },
            { mimetype: 'image/heif' },
            { mimetype: 'image/heic' },
        ]
        const invalidFiles = [
            { mimetype: 'text/plain' },
            { mimetype: 'text/pdf' },
            { mimetype: 'text/docs' },
            { mimetype: 'text/csv' },
        ]
        
        it('should accept valid image types', () => {
            validFiles.forEach(file => {
                fileFilter({}, file, mockCallback)
                expect(mockCallback).toHaveBeenCalledWith(null, true)
                mockCallback.mockClear();
            })
        })
        
        it('should reject invalid file format', () => {
            invalidFiles.forEach(file => {
                fileFilter({}, file, mockCallback)
                expect(mockCallback).toHaveBeenCalledWith(expect.any(Error))
                mockCallback.mockClear();
            })
        }) 
    })

    describe('uploader', () => {
        let mockStorage;
        let mockMulter;

        beforeEach(() => {
            mockStorage = {
                destination: jest.fn(),
                filename: jest.fn()
            }
            mockMulter = jest.fn()
            multer.diskStorage = jest.fn().mockReturnValue(mockStorage)
            multer.mockReturnValue(mockMulter)
        })

        it('should configure multer with disk storage and file filter', () => {
            const result = uploader();

            expect(multer.diskStorage).toHaveBeenCalledWith({
                destination: expect.any(Function),
                filename: expect.any(Function)
            })

            expect(multer).toHaveBeenCalledWith({
                storage: mockStorage,
                fileFilter: fileFilter
            })
            
            expect(result).toBe(mockMulter)
        })

        it('should generate filename with timestamp and extension', () => {
            const mockCallback = jest.fn()
            const fileName = { originalname: 'test.jpg' }
            const mockTimestamp = 123456789

            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp)
            path.extname.mockReturnValue('.jpg')

            multer.diskStorage.mockImplementation(config => {
                config.filename({}, fileName, mockCallback)
                return mockStorage
            })

            uploader();

            expect(path.extname).toHaveBeenCalledWith('test.jpg')
            expect(mockCallback).toHaveBeenCalledWith(null, '123456789.jpg')

            Date.now.mockRestore()
        })
    })
})