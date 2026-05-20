const categoryRepository = require("../repositories/category.repository");

const vendorRepository = require("../repositories/vendor.repository");

const { ValidationError, NotFoundError } = require("../utils/errors");

class CategoryService {
    async findAll() {
        return categoryRepository.findAll();
    }

    async findByVendorId(vendorId) {
        const vendor = await vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }

        return categoryRepository.findByVendorId(vendorId);
    }

    async replaceVendorCategories(vendorId, categoryIds) {
        const vendor = await vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }

        if (!Array.isArray(categoryIds)) {
            throw new ValidationError("category_ids debe ser un arreglo");
        }

        for (const categoryId of categoryIds) {
            const category = await categoryRepository.findById(categoryId);

            if (!category) {
                throw new ValidationError(
                    `La categoría ${categoryId} no existe`,
                );
            }
        }

        return categoryRepository.replaceVendorCategories(
            vendorId,
            categoryIds,
        );
    }
}

module.exports = new CategoryService();
