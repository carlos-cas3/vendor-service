const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(), // guarda en memoria, no en disco
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Solo se aceptan PNG o JPG"));
        }
    },
});

module.exports = upload;