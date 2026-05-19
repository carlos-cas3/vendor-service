// controllers/policy.controller.js
const policyService = require("../services/policy.service");

class PolicyController {
    async findByVendorId(req, res, next) {
        try {
            const vendor_id = parseInt(req.params.vendor_id);
            const policy = await policyService.findByVendorId(vendor_id);
            res.json({ success: true, data: policy });
        } catch (error) {
            next(error);
        }
    }

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
