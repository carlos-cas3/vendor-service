const express = require("express");
const vendorController = require("../controllers/vendor.controller");

const router = express.Router();
const json = express.json();

router.post("/", json, vendorController.create);

router.get("/", vendorController.findAll);

router.get("/:vendor_id", vendorController.findById);

router.patch("/:vendor_id", json, vendorController.update);

router.patch("/:vendor_id/status", json, vendorController.updateStatus);

router.get("/:vendor_id/status", vendorController.getStatus);

router.get("/:vendor_id/name", vendorController.getName);

module.exports = router;
