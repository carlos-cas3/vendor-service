const categoryRepository = require("../repositories/category.repository");

const vendorRepository = require("../repositories/vendor.repository");

const { ValidationError, NotFoundError } = require("../utils/errors");

class CategoryService {
    /**
     * Lista todas las categorías disponibles.
     *
     * @returns {Promise<Array>} Lista de categorías
     */
    async findAll() {
        return categoryRepository.findAll();
    }

    /**
     * Obtiene las categorías asignadas a un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Categorías del proveedor
     * @throws {NotFoundError} Si el proveedor no existe
     */
    async findByVendorId(vendorId) {
        const vendor = await vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }

        return categoryRepository.findByVendorId(vendorId);
    }

    /**
     * Reemplaza todas las categorías asignadas a un proveedor.
     * Valida que el proveedor exista y que cada categoría sea válida.
     *
     * @param {number} vendorId - ID del proveedor
     * @param {number[]} categoryIds - IDs de categorías a asignar
     * @returns {Promise<Array>} Registros creados
     * @throws {NotFoundError} Si el proveedor no existe
     * @throws {ValidationError} Si categoryIds no es un arreglo o contiene IDs inválidos
     */
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
