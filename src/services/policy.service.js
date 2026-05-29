const vendorPolicyRepository = require("../repositories/vendor-policy.repository");

class PolicyService {
    /**
     * Obtiene la política de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Object|null>} Política del proveedor o null
     */
    async findByVendorId(vendorId) {
        return vendorPolicyRepository.findByVendorId(vendorId);
    }

    /**
     * Crea o actualiza la política de un proveedor (upsert).
     *
     * @param {number} vendorId - ID del proveedor
     * @param {string} [description] - Descripción de la política
     * @returns {Promise<Object>} Política guardada
     */
    async upsert(vendorId, description) {
        return vendorPolicyRepository.upsert(vendorId, description ?? "");
    }
}

module.exports = new PolicyService();
