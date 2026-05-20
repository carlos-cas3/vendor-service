const categoryService = require("../services/category.service");

class CategoryController {
    async findAll(req, res, next) {
        try {
            const categories = await categoryService.findAll();

            res.json({
                success: true,
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    }

    async findByVendorId(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);

            if (isNaN(vendorId)) {
                throw new Error("vendor_id inválido");
            }

            const categories = await categoryService.findByVendorId(vendorId);

            res.json({
                success: true,
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    }

    async replaceVendorCategories(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);

            if (isNaN(vendorId)) {
                throw new Error("vendor_id inválido");
            }

            const { category_ids } = req.body;

            await categoryService.replaceVendorCategories(
                vendorId,
                category_ids,
            );

            res.json({
                success: true,
                message: "Categorías actualizadas correctamente",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
