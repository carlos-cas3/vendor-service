const express = require("express");

const branchController = require("../controllers/branch.controller");

const router = express.Router();

router.post("/:vendor_id/branches", express.json(), branchController.create);

router.get("/:vendor_id/branches", branchController.findByVendorId);

router.get("/branches/:branch_id", branchController.findById);

router.put("/branches/:branch_id", express.json(), branchController.update);

router.patch(
    "/branches/:branch_id/status",
    express.json(),
    branchController.updateStatus,
);

router.delete("/branches/:branch_id", branchController.deactivate);

module.exports = router;
