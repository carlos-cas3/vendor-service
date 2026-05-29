const categoryService = require("../services/category.service");

class CategoryController {
    /**
     * Lista todas las categorías disponibles.
     *
     * @param {import('express').Request} req - Request
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * GET /api/vendors/categories
     */
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

    /**
     * Obtiene las categorías asignadas a un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     *
     * @example
     * GET /api/vendors/1/categories
     */
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

    /**
     * Reemplaza todas las categorías asignadas a un proveedor.
     * Elimina las existentes e inserta las nuevas.
     *
     * @param {import('express').Request} req - Request con vendor_id en params y category_ids en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     * @throws {ValidationError} Si algún category_id no es válido
     *
     * @example
     * PUT /api/vendors/1/categories
     * { "category_ids": [1, 2, 5] }
     */
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
