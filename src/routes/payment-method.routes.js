const express = require("express");
const paymentMethodController = require("../controllers/payment-method.controller");

const router = express.Router();
const json = express.json();

router.get("/payment-methods", paymentMethodController.findAll);

router.get(
    "/:vendor_id/payment-methods",
    paymentMethodController.findByVendorId,
);

router.put(
    "/:vendor_id/payment-methods",
    json,
    paymentMethodController.replaceVendorPaymentMethods,
);

module.exports = router;
