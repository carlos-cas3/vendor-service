const express = require("express");

const vendorRoutes = require("./vendor.routes");
const branchRoutes = require("./branch.routes");
const policyRoutes = require("./policy.routes");
const paymentMethodRoutes = require("./payment-method.routes");
const logoRoutes = require("./logo.routes");

const router = express.Router();

router.use("/", paymentMethodRoutes);

router.use("/", vendorRoutes);

router.use("/", policyRoutes);

router.use("/", branchRoutes);

router.use("/", logoRoutes);

module.exports = router;