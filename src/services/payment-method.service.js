const paymentMethodRepository = require("../repositories/payment-method.repository");

class PaymentMethodService {
    /**
     * Lista todos los métodos de pago disponibles.
     *
     * @returns {Promise<Array>} Lista de métodos de pago
     */
    async findAll() {
        return paymentMethodRepository.findAll();
    }

    /**
     * Obtiene los métodos de pago asignados a un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Métodos de pago del proveedor
     */
    async findByVendorId(vendorId) {
        return paymentMethodRepository.findByVendorId(vendorId);
    }

    /**
     * Reemplaza los métodos de pago asignados a un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @param {number[]} paymentMethodIds - IDs de métodos de pago a asignar
     * @returns {Promise<Array>} Registros creados
     * @throws {Error} Si paymentMethodIds no es un arreglo
     */
    async replaceVendorPaymentMethods(vendorId, paymentMethodIds) {
        if (!Array.isArray(paymentMethodIds)) {
            throw new Error("payment_method_ids debe ser un arreglo");
        }

        return paymentMethodRepository.replaceVendorPaymentMethods(
            vendorId,
            paymentMethodIds,
        );
    }
}

module.exports = new PaymentMethodService();
