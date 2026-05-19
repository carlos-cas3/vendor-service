const express = require("express");
const logoController = require("../controllers/logo.controller");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post(
    "/:vendor_id/logo",
    upload.single("logo"),
    logoController.upload
);

module.exports = router;