const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const fileFilter = (req, file, callback) => {
    const allowedTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/gif',
        'image/bmp',
        'image/webp',
        'image/svg+xml',
        'image/svg',
        'image/tiff',
        'image/heif',
        'image/heic',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Invalid file format'));
    }
};

const uploader = () => {
    const UPLOAD_PATH = 'public/uploads';
    const storage = multer.diskStorage({
        destination(req, file, callback) {
            callback(null, UPLOAD_PATH);
        },
        filename(req, file, callback) {
            const ext = path.extname(file.originalname);
            const fileName = `${Date.now()}${ext}`;
            callback(null, fileName);
        },
    });

    return multer({ storage, fileFilter });
};

const generateThumb = (req, res, next) => {
    req.files?.forEach((f) => {
        fs.readFile(`public/uploads/${f.filename}`, async (err, stream) => {
            if (err) throw err;
            await sharp(stream.buffer).resize(200, 200).toFile(`public/uploads/thumbs/${f.filename}`);
        });
    });
    next();
};

module.exports = {
    fileFilter,
    uploader,
    generateThumb,
};
