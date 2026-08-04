import multer from "multer";

// Files are kept in memory only long enough to stream them up to
// Cloudinary — nothing is written to local disk anymore, since
// platforms like Render use an ephemeral filesystem that gets wiped
// on every restart/redeploy.
const storage = multer.memoryStorage();

const ALLOWED_MIMETYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "video/mp4",
    "video/quicktime",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed.`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
});

export default upload;
