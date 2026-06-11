const express = require("express");
const staffController = require("../controllers/staff.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const router = express.Router();

router.get(
    "/staff",
    authMiddleware,
    requireRole([ROLES.VENDOR_ADMIN]),
    staffController.list,
);

router.post(
    "/staff",
    authMiddleware,
    requireRole([ROLES.VENDOR_ADMIN]),
    staffController.create,
);

router.get(
    "/staff/:staff_id",
    authMiddleware,
    requireRole([ROLES.VENDOR_ADMIN]),
    staffController.findById,
);

router.patch(
    "/staff/:staff_id",
    authMiddleware,
    requireRole([ROLES.VENDOR_ADMIN]),
    staffController.update,
);

router.delete(
    "/staff/:staff_id",
    authMiddleware,
    requireRole([ROLES.VENDOR_ADMIN]),
    staffController.deactivate,
);

module.exports = router;
