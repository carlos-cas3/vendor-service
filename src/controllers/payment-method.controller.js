const paymentMethodService = require("../services/payment-method.service");
const { ValidationError } = require("../utils/errors");

class PaymentMethodController {
    /**
     * Lista todos los métodos de pago disponibles.
     *
     * @param {import('express').Request} req - Request
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * GET /api/vendors/payment-methods
     */
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

    /**
     * Obtiene los métodos de pago asignados a un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * GET /api/vendors/1/payment-methods
     */
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

    /**
     * Reemplaza los métodos de pago asignados a un proveedor.
     * Elimina los existentes e inserta los nuevos.
     *
     * @param {import('express').Request} req - Request con vendor_id en params y payment_method_ids en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * PUT /api/vendors/1/payment-methods
     * { "payment_method_ids": [1, 3, 4] }
     */
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
