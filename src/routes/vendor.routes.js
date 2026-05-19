const express = require("express");
const { Router } = require("express");
const vendorController = require("../controllers/vendor.controller");
const branchController = require("../controllers/branch.controller");
const policyController = require("../controllers/policy.controller");
const logoController = require("../controllers/logo.controller");
const upload = require("../middleware/upload.middleware");

const router = Router();
const json = express.json();

// VENDORS
router.post("/", json, vendorController.create);
router.get("/", vendorController.findAll);
router.get("/:vendor_id", vendorController.findById);
router.put("/:vendor_id", json, vendorController.update);
router.patch("/:vendor_id/status", json, vendorController.updateStatus);
router.get("/:vendor_id/status", vendorController.getStatus);

// LOGO — sin json(), multer maneja el body
router.post("/:vendor_id/logo", upload.single("logo"), logoController.upload);

// POLICY
router.get("/:vendor_id/policy", policyController.findByVendorId);
router.put("/:vendor_id/policy", json, policyController.upsert);

// BRANCHES
router.post("/:vendor_id/branches", json, branchController.create);
router.get("/:vendor_id/branches", branchController.findByVendorId);

const directBranchRouter = Router();
directBranchRouter.get("/branches/:branch_id", branchController.findById);
directBranchRouter.put("/branches/:branch_id", json, branchController.update);
directBranchRouter.patch(
    "/branches/:branch_id/status",
    json,
    branchController.updateStatus,
);
directBranchRouter.delete("/branches/:branch_id", branchController.delete);

module.exports = { router, directBranchRouter };
