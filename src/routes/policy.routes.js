const express = require("express");
const policyController = require("../controllers/policy.controller");

const router = express.Router();
const json = express.json();

router.get(
    "/:vendor_id/policy",
    policyController.findByVendorId
);

router.put(
    "/:vendor_id/policy",
    json,
    policyController.upsert
);

module.exports = router;