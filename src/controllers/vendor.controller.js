const vendorService = require("../services/vendor.service");

class VendorController {
    /**
     * Crea un nuevo proveedor.
     *
     * @param {import('express').Request} req - Request con datos del proveedor en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * POST /api/vendors
     * { "vendor_name": "Distribuidora ABC", "vendor_email": "contacto@abc.com", "vendor_ruc": "12345678901", "user_id": 42 }
     */
    async create(req, res, next) {
        try {
            const vendor = await vendorService.createVendor(req.body);
            res.status(201).json({
                success: true,
                message: "Proveedor creado exitosamente",
                data: vendor,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista proveedores con filtros opcionales.
     *
     * @param {import('express').Request} req - Request con query params (vendor_status, vendor_email, vendor_ruc)
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * GET /api/vendors?vendor_status=ACTIVE
     */
    async findAll(req, res, next) {
        try {
            const filters = {
                vendor_status: req.query.vendor_status,
                vendor_email: req.query.vendor_email,
                vendor_ruc: req.query.vendor_ruc,
            };

            Object.keys(filters).forEach((k) => {
                if (filters[k] === undefined) delete filters[k];
            });

            const vendors = await vendorService.findAll(filters);
            res.json({
                success: true,
                data: vendors,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtiene un proveedor por su ID.
     *
     * @param {import('express').Request} req - Request con vendor_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     *
     * @example
     * GET /api/vendors/1
     */
    async findById(req, res, next) {
        try {
            const vendor_id = parseInt(req.params.vendor_id); // añadir parseInt
            const vendor = await vendorService.findById(vendor_id);
            res.json({ success: true, data: vendor });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualiza los datos de un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params y datos en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     * @throws {ConflictError} Si el email o RUC ya están registrados
     *
     * @example
     * PATCH /api/vendors/1
     * { "vendor_name": "Nuevo Nombre", "vendor_phone": "+525598765432" }
     */
    async update(req, res, next) {
        try {
            const vendor = await vendorService.update(
                req.params.vendor_id,
                req.body,
            );
            res.json({
                success: true,
                message: "Proveedor actualizado exitosamente",
                data: vendor,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualiza el estado de un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params y status en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {ValidationError} Si el estado no es válido
     * @throws {NotFoundError} Si el proveedor no existe
     *
     * @example
     * PATCH /api/vendors/1/status
     * { "status": "ACTIVE" }
     */
    async updateStatus(req, res, next) {
        try {
            const vendor_id = parseInt(req.params.vendor_id); // añadir parseInt
            const vendor = await vendorService.updateStatus(
                vendor_id,
                req.body.status,
            );
            res.json({
                success: true,
                message: "Estado del proveedor actualizado exitosamente",
                data: vendor,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtiene el estado actual de un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     *
     * @example
     * GET /api/vendors/1/status
     */
    async getStatus(req, res, next) {
        try {
            const result = await vendorService.getStatus(req.params.vendor_id);
            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getName(req, res, next) {
        try {
            const vendor_id = parseInt(req.params.vendor_id);
            const result = await vendorService.getVendorName(vendor_id);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VendorController();
