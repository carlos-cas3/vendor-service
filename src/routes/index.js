const express = require("express");

const vendorRoutes = require("./vendor.routes");
const branchRoutes = require("./branch.routes");
const policyRoutes = require("./policy.routes");
const paymentMethodRoutes = require("./payment-method.routes");
const logoRoutes = require("./logo.routes");
const categoryRoutes = require("./category.routes");
const commissionRoutes = require("./commission.routes");
const staffRoutes = require("./staff.routes");


const router = express.Router();

router.use("/", branchRoutes);

router.use("/", policyRoutes);

router.use("/", paymentMethodRoutes);

router.use("/", logoRoutes);

router.use("/", categoryRoutes);

router.use("/", staffRoutes);

router.use("/", vendorRoutes);

router.use("/", commissionRoutes);

module.exports = router;
