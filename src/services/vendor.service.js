const vendorRepository = require("../repositories/vendor.repository");
const {
    ValidationError,
    NotFoundError,
    ConflictError,
} = require("../utils/errors");
const authClient = require("../clients/auth.client");

class VendorService {
    /**
     * Crea un nuevo proveedor con validación de datos.
     * Si se proporcionan categorías, las asigna automáticamente.
     *
     * @param {Object} data - Datos del proveedor
     * @param {string} data.vendor_name - Nombre del proveedor
     * @param {string} data.vendor_email - Email del proveedor
     * @param {string} data.vendor_ruc - RUC del proveedor
     * @param {number} data.user_id - ID del usuario asociado
     * @param {string} [data.vendor_phone] - Teléfono del proveedor
     * @param {string} [data.vendor_address] - Dirección del proveedor
     * @param {number[]} [data.categories] - IDs de categorías a asignar
     * @returns {Promise<Object>} Proveedor creado
     * @throws {ValidationError} Si los datos no son válidos
     */
    async createVendor(data) {
        this._validateCreate(data);

        const vendor = await vendorRepository.create(data);

        if (data.categories?.length > 0) {
            await vendorRepository.addCategories(
                vendor.vendor_id,
                data.categories,
            );
        }

        return vendor;
    }

    /**
     * Lista proveedores con filtros opcionales.
     *
     * @param {Object} [filters] - Filtros de búsqueda
     * @param {string} [filters.vendor_status] - Filtrar por estado
     * @param {string} [filters.vendor_email] - Filtrar por email
     * @param {string} [filters.vendor_ruc] - Filtrar por RUC
     * @returns {Promise<Array>} Lista de proveedores
     */
    async findAll(filters = {}) {
        return vendorRepository.findAll(filters);
    }

    /**
     * Busca un proveedor por su ID.
     *
     * @param {number} vendor_id - ID del proveedor
     * @returns {Promise<Object>} Proveedor encontrado
     * @throws {NotFoundError} Si el proveedor no existe
     */
    async findById(vendor_id) {
        const vendor = await vendorRepository.findById(vendor_id);
        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }
        return vendor;
    }

    /**
     * Actualiza los datos de un proveedor.
     * Verifica unicidad de email y RUC antes de actualizar.
     *
     * @param {number} vendor_id - ID del proveedor
     * @param {Object} data - Datos a actualizar
     * @param {string} [data.vendor_name] - Nuevo nombre
     * @param {string} [data.vendor_email] - Nuevo email
     * @param {string} [data.vendor_phone] - Nuevo teléfono
     * @param {string} [data.vendor_address] - Nueva dirección
     * @returns {Promise<Object>} Proveedor actualizado
     * @throws {NotFoundError} Si el proveedor no existe
     * @throws {ConflictError} Si el email o RUC ya están registrados
     */
    async update(vendor_id, data) {
        const vendor = await this.findById(vendor_id);

        if (data.vendor_email && data.vendor_email !== vendor.vendor_email) {
            const existingEmail = await vendorRepository.findByEmail(
                data.vendor_email,
            );
            if (existingEmail) {
                throw new ConflictError(
                    "El email ya está registrado por otro proveedor",
                );
            }
        }

        if (data.vendor_ruc && data.vendor_ruc !== vendor.vendor_ruc) {
            const existingTaxId = await vendorRepository.findByTaxId(
                data.vendor_ruc,
            );
            if (existingTaxId) {
                throw new ConflictError(
                    "El RUC ya está registrado por otro proveedor",
                );
            }
        }

        return vendorRepository.update(vendor_id, data);
    }

    /**
     * Actualiza el estado de un proveedor.
     * Sincroniza el cambio con el auth-service si el proveedor tiene user_id.
     *
     * @param {number} vendor_id - ID del proveedor
     * @param {string} status - Nuevo estado (PENDING, ACTIVE, INACTIVE, SUSPENDED)
     * @returns {Promise<Object>} Proveedor actualizado
     * @throws {ValidationError} Si el estado no es válido
     * @throws {NotFoundError} Si el proveedor no existe
     */
    async updateStatus(vendor_id, status) {
        const validStatuses = ["PENDING", "ACTIVE", "INACTIVE", "SUSPENDED"];
        if (!validStatuses.includes(status)) {
            throw new ValidationError(
                `Estado inválido. Debe ser: ${validStatuses.join(", ")}`,
            );
        }

        const vendor = await this.findById(vendor_id);
        const updated = await vendorRepository.updateStatus(vendor_id, status);

        if (vendor.user_id) {
            await authClient.updateUserStatus(vendor.user_id, status);
        }

        return updated;
    }

    /**
     * Obtiene el estado actual de un proveedor.
     *
     * @param {number} vendor_id - ID del proveedor
     * @returns {Promise<Object>} Objeto con vendor_id y status
     * @throws {NotFoundError} Si el proveedor no existe
     */
    async getStatus(vendor_id) {
        const vendor = await this.findById(vendor_id);
        return { vendor_id: vendor.vendor_id, status: vendor.vendor_status };
    }

    /**
     * Valida los datos requeridos para crear un proveedor.
     *
     * @param {Object} data - Datos a validar
     * @throws {ValidationError} Si algún campo requerido falta o es inválido
     */
    _validateCreate(data) {
        const errors = [];

        if (!data.vendor_name) {
            errors.push("vendor_name es requerido");
        }

        if (!data.vendor_email || !this._isValidEmail(data.vendor_email)) {
            errors.push("Email válido es requerido");
        }

        if (!data.vendor_ruc) {
            errors.push("RUC es requerido");
        }

        if (!data.user_id) {
            errors.push("user_id es requerido");
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join("; "));
        }
    }

    /**
     * Valida el formato de un email.
     *
     * @param {string} email - Email a validar
     * @returns {boolean} true si el formato es válido
     */
    _isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

module.exports = new VendorService();
