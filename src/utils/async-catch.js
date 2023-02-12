const asyncCatch = (func) => (req, res, next) => {
    func(req, res, next).catch(next);
};

module.exports = asyncCatch;
