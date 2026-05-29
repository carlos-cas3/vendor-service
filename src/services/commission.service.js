const commissionRepository = require("../repositories/commission.repository");
const vendorRepository = require("../repositories/vendor.repository");
const { NotFoundError, ValidationError } = require("../utils/errors");

class CommissionService {
    /**
     * Obtiene la configuración de comisión de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Object|null>} Configuración de comisión o null
     * @throws {NotFoundError} Si el proveedor no existe
     */
    async findByVendorId(vendorId) {
        const vendor = await vendorRepository.findById(vendorId);
        if (!vendor) throw new NotFoundError("Proveedor no encontrado");

        const configs = await commissionRepository.findByVendorId(vendorId);
        return configs[0] ?? null; // solo devuelve el primero o null
    }

    /**
     * Crea una configuración de comisión para un proveedor.
     * Si ya existe una configuración, la actualiza en lugar de crear duplicados.
     *
     * @param {number} vendorId - ID del proveedor
     * @param {Object} data - Datos de la comisión
     * @param {number} data.commission_rate - Tasa de comisión (0 a 1)
     * @returns {Promise<Object>} Configuración creada o actualizada
     * @throws {NotFoundError} Si el proveedor no existe
     * @throws {ValidationError} Si la tasa no es válida
     */
    async create(vendorId, data) {
        const vendor = await vendorRepository.findById(vendorId);
        if (!vendor) throw new NotFoundError("Proveedor no encontrado");

        // Verificar si ya existe — si existe, actualizar en lugar de crear
        const existing = await commissionRepository.findByVendorId(vendorId);
        if (existing.length > 0) {
            this._validate(data.commission_rate);
            return commissionRepository.update(
                existing[0].config_id,
                data.commission_rate,
            );
        }

        this._validate(data.commission_rate);
        return commissionRepository.create({
            vendor_id: vendorId,
            commission_rate: data.commission_rate,
        });
    }

    /**
     * Actualiza una configuración de comisión existente.
     *
     * @param {number} configId - ID de la configuración
     * @param {Object} data - Datos a actualizar
     * @param {number} data.commission_rate - Nueva tasa de comisión (0 a 1)
     * @returns {Promise<Object>} Configuración actualizada
     * @throws {NotFoundError} Si la configuración no existe
     * @throws {ValidationError} Si la tasa no es válida
     */
    async update(configId, data) {
        const config = await commissionRepository.findById(configId);
        if (!config) throw new NotFoundError("Configuración no encontrada");

        this._validate(data.commission_rate);

        return commissionRepository.update(configId, data.commission_rate);
    }

    /**
     * Elimina una configuración de comisión.
     *
     * @param {number} configId - ID de la configuración
     * @returns {Promise<boolean>} true si se eliminó correctamente
     * @throws {NotFoundError} Si la configuración no existe
     */
    async delete(configId) {
        const config = await commissionRepository.findById(configId);
        if (!config) throw new NotFoundError("Configuración no encontrada");

        return commissionRepository.delete(configId);
    }

    /**
     * Valida que commission_rate sea un número entre 0 y 1.
     *
     * @param {*} commission_rate - Valor a validar
     * @throws {ValidationError} Si el valor no es válido
     */
    _validate(commission_rate) {
        if (commission_rate === undefined || commission_rate === null) {
            throw new ValidationError("commission_rate es requerido");
        }
        if (
            isNaN(commission_rate) ||
            commission_rate < 0 ||
            commission_rate > 1
        ) {
            throw new ValidationError(
                "commission_rate debe ser un número entre 0 y 1",
            );
        }
    }
}

module.exports = new CommissionService();
