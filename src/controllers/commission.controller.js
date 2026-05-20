const commissionService = require("../services/commission.service");

class CommissionController {
    async findByVendorId(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);
            if (isNaN(vendorId)) throw new Error("vendor_id inválido");

            const config = await commissionService.findByVendorId(vendorId);
            res.json({ success: true, data: config });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);
            if (isNaN(vendorId)) throw new Error("vendor_id inválido");

            const config = await commissionService.create(vendorId, req.body);
            res.status(201).json({ success: true, data: config });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const configId = parseInt(req.params.config_id);
            if (isNaN(configId)) throw new Error("config_id inválido");

            const config = await commissionService.update(configId, req.body);
            res.json({ success: true, data: config });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const configId = parseInt(req.params.config_id);
            if (isNaN(configId)) throw new Error("config_id inválido");

            await commissionService.delete(configId);
            res.json({ success: true, message: "Configuración eliminada" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommissionController();
