const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
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
        cb(null, true);
    } else {
        cb('Invalid file format');
    }
};

exports.uploader = () => {
    const UPLOAD_PATH = 'public/uploads';
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, UPLOAD_PATH);
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            const fileName = `${Date.now()}${ext}`;
            cb(null, fileName);
        },
    });

    return multer({ storage, fileFilter });
};
