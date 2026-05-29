const branchRepository = require("../repositories/branch.repository");

const vendorRepository = require("../repositories/vendor.repository");

const cityRepository = require("../repositories/city.repository");

const { ValidationError, NotFoundError } = require("../utils/errors");

class BranchService {
    /**
     * Crea una nueva sucursal para un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @param {Object} data - Datos de la sucursal
     * @param {number} data.city_id - ID de la ciudad
     * @param {string} data.branch_address - Dirección de la sucursal
     * @param {string} [data.branch_name] - Nombre de la sucursal
     * @returns {Promise<Object>} Sucursal creada
     * @throws {NotFoundError} Si el proveedor no existe
     * @throws {ValidationError} Si los datos no son válidos
     */
    async create(vendorId, data) {
        const vendor = await vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }

        await this._validateCreate(data);

        return branchRepository.create({
            vendor_id: vendorId,

            city_id: data.city_id,

            branch_name: data.branch_name || null,

            branch_address: data.branch_address,

            branch_status: "ACTIVE",
        });
    }

    /**
     * Lista sucursales activas o en mantenimiento de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Lista de sucursales activas o en mantenimiento
     * @throws {NotFoundError} Si el proveedor no existe
     */
    async findActiveByVendorId(vendorId) {
        const vendor = await vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }

        return branchRepository.findActiveByVendorId(vendorId);
    }

    /**
     * Lista sucursales de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Lista de sucursales
     * @throws {NotFoundError} Si el proveedor no existe
     */
    async findByVendorId(vendorId) {
        const vendor = await vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }

        return branchRepository.findByVendorId(vendorId);
    }

    /**
     * Busca una sucursal por su ID.
     *
     * @param {number} branchId - ID de la sucursal
     * @returns {Promise<Object>} Sucursal encontrada
     * @throws {NotFoundError} Si la sucursal no existe
     */
    async findById(branchId) {
        const branch = await branchRepository.findById(branchId);

        if (!branch) {
            throw new NotFoundError("Sucursal no encontrada");
        }

        return branch;
    }

    /**
     * Actualiza los datos de una sucursal.
     *
     * @param {number} branchId - ID de la sucursal
     * @param {Object} data - Datos a actualizar
     * @param {number} [data.city_id] - Nueva ciudad
     * @param {string} [data.branch_name] - Nuevo nombre
     * @param {string} [data.branch_address] - Nueva dirección
     * @returns {Promise<Object>} Sucursal actualizada
     * @throws {NotFoundError} Si la sucursal no existe
     * @throws {ValidationError} Si los datos no son válidos
     */
    async update(branchId, data) {
        await this.findById(branchId);
        await this._validateUpdate(data);

        const payload = {};

        if (data.city_id !== undefined) {
            payload.city_id = data.city_id;
        }

        if (data.branch_name !== undefined) {
            payload.branch_name = data.branch_name;
        }

        if (data.branch_address !== undefined) {
            payload.branch_address = data.branch_address;
        }

        return branchRepository.update(branchId, payload);
    }

    /**
     * Actualiza el estado de una sucursal.
     *
     * @param {number} branchId - ID de la sucursal
     * @param {string} branchStatus - Nuevo estado (ACTIVE, INACTIVE, MAINTENANCE)
     * @returns {Promise<Object>} Sucursal actualizada
     * @throws {NotFoundError} Si la sucursal no existe
     * @throws {ValidationError} Si el estado no es válido
     */
    async updateStatus(branchId, branchStatus) {
        const validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

        if (!validStatuses.includes(branchStatus)) {
            throw new ValidationError(
                `Estado inválido. Debe ser: ${validStatuses.join(", ")}`,
            );
        }

        await this.findById(branchId);

        return branchRepository.updateStatus(branchId, branchStatus);
    }

    /**
     * Desactiva una sucursal (establece estado INACTIVE).
     *
     * @param {number} branchId - ID de la sucursal
     * @returns {Promise<Object>} Sucursal desactivada
     * @throws {NotFoundError} Si la sucursal no existe
     */
    async deactivate(branchId) {
        await this.findById(branchId);

        return branchRepository.updateStatus(branchId, "INACTIVE");
    }

    /**
     * Valida los datos para crear una sucursal.
     *
     * @param {Object} data - Datos a validar
     * @throws {ValidationError} Si algún campo es inválido
     */
    async _validateCreate(data) {
        const errors = [];

        if (!data.city_id || isNaN(data.city_id)) {
            errors.push("city_id es requerido");
        }

        if (!data.branch_address || typeof data.branch_address !== "string") {
            errors.push("branch_address es requerido");
        }

        if (data.branch_name && typeof data.branch_name !== "string") {
            errors.push("branch_name debe ser texto");
        }

        const city = await cityRepository.findById(data.city_id);

        if (!city) {
            errors.push("La ciudad no existe");
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join("; "));
        }
    }

    /**
     * Valida los datos para actualizar una sucursal.
     *
     * @param {Object} data - Datos a validar
     * @throws {ValidationError} Si algún campo es inválido
     */
    async _validateUpdate(data) {
        const errors = [];

        if (data.city_id && isNaN(data.city_id)) {
            errors.push("city_id inválido");
        }

        if (data.branch_address && typeof data.branch_address !== "string") {
            errors.push("branch_address inválido");
        }

        if (data.branch_name && typeof data.branch_name !== "string") {
            errors.push("branch_name inválido");
        }

        if (data.city_id) {
            const city = await cityRepository.findById(data.city_id);

            if (!city) {
                errors.push("La ciudad no existe");
            }
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join("; "));
        }
    }
}

module.exports = new BranchService();
