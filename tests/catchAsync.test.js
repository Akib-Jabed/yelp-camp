const catchAsync = require('../src/utils/catchAsync')

describe('catchAsync', () => {
    let req, res, next;

    beforeEach(() => {
        req = {}
        res = {}
        next = jest.fn()
    })

    it('should call the wrapped function when resolved', async () => {
        const handler = jest.fn().mockResolvedValue('ok')
        const wrapped = catchAsync(handler);

        await wrapped(req, res, next)

        expect(handler).toHaveBeenCalledWith(req, res, next)
        expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error when rejected', async () => {
        const error = new Error('Something went wrong')
        const handler = jest.fn().mockRejectedValue(error)
        const wrapped = catchAsync(handler);

        await wrapped(req, res, next)

        expect(handler).toHaveBeenCalledWith(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
    })

    describe('intgration scenarios', () => {
        
    })
})