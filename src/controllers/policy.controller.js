const policyService = require("../services/policy.service");

class PolicyController {
    /**
     * Obtiene la política de un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * GET /api/vendors/1/policy
     */
    async findByVendorId(req, res, next) {
        try {
            const vendor_id = parseInt(req.params.vendor_id);
            const policy = await policyService.findByVendorId(vendor_id);
            res.json({ success: true, data: policy });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Crea o actualiza la política de un proveedor (upsert).
     *
     * @param {import('express').Request} req - Request con vendor_id en params y description en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * PUT /api/vendors/1/policy
     * { "description": "Política de devolución: 30 días" }
     */
    async upsert(req, res, next) {
        try {
            const vendor_id = parseInt(req.params.vendor_id);
            const { description } = req.body;
            const policy = await policyService.upsert(vendor_id, description);
            res.json({
                success: true,
                message: "Política guardada exitosamente",
                data: policy,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PolicyController();
