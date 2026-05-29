const multer = require("multer");

/**
 * Middleware de multer para subida de archivos.
 * Almacena en memoria, límite de 2MB, solo PNG/JPG.
 *
 * @type {import('multer').Multer}
 *
 * @example
 * router.post("/:vendor_id/logo", upload.single("logo"), logoController.upload);
 */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Solo se aceptan PNG o JPG"));
        }
    },
});

module.exports = upload;