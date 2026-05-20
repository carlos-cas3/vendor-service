const express = require("express");
const router = express.Router();
const commissionController = require("../controllers/commission.controller");

// SUPER_ADMIN + VENDOR_ADMIN — solo lectura
router.get("/:vendor_id/commission", commissionController.findByVendorId);

// Solo SUPER_ADMIN — escritura
router.post(
    "/:vendor_id/commission",
    express.json(),
    commissionController.create,
);
router.put(
    "/commission/:config_id",
    express.json(),
    commissionController.update,
);
router.delete("/commission/:config_id", commissionController.delete);

module.exports = router;
