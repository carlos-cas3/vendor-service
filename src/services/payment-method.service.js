const paymentMethodRepository = require("../repositories/payment-method.repository");

class PaymentMethodService {
    async findAll() {
        return paymentMethodRepository.findAll();
    }

    async findByVendorId(vendorId) {
        return paymentMethodRepository.findByVendorId(vendorId);
    }

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
