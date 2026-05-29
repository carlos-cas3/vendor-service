const commissionService = require("../services/commission.service");

class CommissionController {
    /**
     * Obtiene la configuración de comisión de un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     *
     * @example
     * GET /api/vendors/1/commission
     */
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

    /**
     * Crea una configuración de comisión para un proveedor.
     * Si ya existe una configuración, la actualiza.
     *
     * @param {import('express').Request} req - Request con vendor_id en params y commission_rate en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     * @throws {ValidationError} Si commission_rate no es válido
     *
     * @example
     * POST /api/vendors/1/commission
     * { "commission_rate": 0.15 }
     */
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

    /**
     * Actualiza una configuración de comisión existente.
     *
     * @param {import('express').Request} req - Request con config_id en params y commission_rate en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si la configuración no existe
     * @throws {ValidationError} Si commission_rate no es válido
     *
     * @example
     * PUT /api/vendors/commission/1
     * { "commission_rate": 0.20 }
     */
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

    /**
     * Elimina una configuración de comisión.
     *
     * @param {import('express').Request} req - Request con config_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si la configuración no existe
     *
     * @example
     * DELETE /api/vendors/commission/1
     */
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
