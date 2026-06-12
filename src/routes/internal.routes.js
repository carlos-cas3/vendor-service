const express = require("express");
const staffController = require("../controllers/staff.controller");
const { serviceAuthMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
    "/internal/staff",
    serviceAuthMiddleware,
    staffController.listInternal,
);

module.exports = router;
