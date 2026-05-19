const paymentMethodService = require("../services/payment-method.service");
const { ValidationError } = require("../utils/errors");

class PaymentMethodController {
    async findAll(req, res, next) {
        try {
            const methods = await paymentMethodService.findAll();

            res.json({
                success: true,
                data: methods,
            });
        } catch (error) {
            next(error);
        }
    }

    async findByVendorId(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);
            if (isNaN(vendorId)) {
                throw new ValidationError("vendor_id inválido");
            }

            const methods = await paymentMethodService.findByVendorId(vendorId);

            res.json({
                success: true,
                data: methods,
            });
        } catch (error) {
            next(error);
        }
    }

    async replaceVendorPaymentMethods(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);
            if (isNaN(vendorId)) {
                throw new ValidationError("vendor_id inválido");
            }

            const { payment_method_ids } = req.body;

            await paymentMethodService.replaceVendorPaymentMethods(
                vendorId,
                payment_method_ids,
            );

            res.json({
                success: true,
                message: "Métodos de pago actualizados correctamente",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentMethodController();
