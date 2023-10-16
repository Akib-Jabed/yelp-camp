const sharp = require('sharp');
const fs = require('fs');

module.exports.generateThumb = (req, res, next) => {
    req.files.forEach((f) => {
        fs.readFile(`public/uploads/${f.filename}`, async (err, stream) => {
            if (err) throw err;
            await sharp(stream.buffer)
                .resize(200, 200)
                .toFile(`public/uploads/thumbs/${f.filename}`);
        });
    });
    next();
};
