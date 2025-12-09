const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

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

// const uploader = () => {
//     const UPLOAD_PATH = 'public/uploads';
//     const storage = multer.diskStorage({
//         destination(req, file, callback) {
//             callback(null, UPLOAD_PATH);
//         },
//         filename(req, file, callback) {
//             const ext = path.extname(file.originalname);
//             const fileName = `${Date.now()}${ext}`;
//             callback(null, fileName);
//         },
//     });

//     return multer({ storage, fileFilter });
// };

const uploader = () => {
    const storage = multer.memoryStorage();
    return multer({ storage, fileFilter });
}

const uploadToCloudinary = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next()
    }

    try {
        const uploadPromises = req.files.map(async (file) => {
            const ext = path.extname(file.originalname);
            const filename = `${Date.now()}${ext}`;
            const publicId = filename.replace(ext, '');

            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'yelp-camp',
                    public_id: publicId,
                    resource_type: 'image',
                    transformation: [
                        {
                            quality: 'auto',
                            fetch_format: 'auto'
                        }
                    ]
                }, (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })
                uploadStream.end(file.buffer);
            });
        })

        const uploadResult = await Promise.all(uploadPromises);
        req.cloudinaryResults = uploadResult
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = {
    fileFilter,
    uploader,
    uploadToCloudinary
};
