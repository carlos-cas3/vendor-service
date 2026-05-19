const express = require("express");
const branchController = require("../controllers/branch.controller");

const router = express.Router();
const json = express.json();

router.post(
    "/:vendor_id/branches",
    json,
    branchController.create
);

router.get(
    "/:vendor_id/branches",
    branchController.findByVendorId
);

router.get(
    "/branches/:branch_id",
    branchController.findById
);

router.put(
    "/branches/:branch_id",
    json,
    branchController.update
);

router.patch(
    "/branches/:branch_id/status",
    json,
    branchController.updateStatus
);

router.delete(
    "/branches/:branch_id",
    branchController.delete
);

module.exports = router;