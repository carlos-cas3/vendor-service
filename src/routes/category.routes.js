const express = require("express");

const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/categories", categoryController.findAll);

router.get("/:vendor_id/categories", categoryController.findByVendorId);

router.put(
    "/:vendor_id/categories",
    express.json(),
    categoryController.replaceVendorCategories,
);

module.exports = router;
