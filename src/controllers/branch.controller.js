const branchService = require("../services/branch.service");

class BranchController {
    /**
     * Crea una nueva sucursal para un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params y datos en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     * @throws {ValidationError} Si los datos son inválidos
     *
     * @example
     * POST /api/vendors/1/branches
     * { "city_id": 1, "branch_address": "Calle 123", "branch_name": "Sucursal Centro" }
     */
    async create(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);

            if (isNaN(vendorId)) {
                throw new Error("vendor_id inválido");
            }

            const branch = await branchService.create(vendorId, req.body);

            res.status(201).json({
                success: true,
                message: "Sucursal creada exitosamente",
                data: branch,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista sucursales activas de un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     *
     * @example
     * GET /api/vendors/1/branches/active
     */
    async findActiveByVendorId(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);

            if (isNaN(vendorId)) {
                throw new Error("vendor_id inválido");
            }

            const branches = await branchService.findActiveByVendorId(vendorId);

            res.json({
                success: true,
                data: branches,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista sucursales de un proveedor.
     *
     * @param {import('express').Request} req - Request con vendor_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si el proveedor no existe
     *
     * @example
     * GET /api/vendors/1/branches
     */
    async findByVendorId(req, res, next) {
        try {
            const vendorId = parseInt(req.params.vendor_id);

            if (isNaN(vendorId)) {
                throw new Error("vendor_id inválido");
            }

            const branches = await branchService.findByVendorId(vendorId);

            res.json({
                success: true,
                data: branches,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtiene una sucursal por su ID.
     *
     * @param {import('express').Request} req - Request con branch_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si la sucursal no existe
     *
     * @example
     * GET /api/vendors/branches/1
     */
    async findById(req, res, next) {
        try {
            const branchId = parseInt(req.params.branch_id);

            if (isNaN(branchId)) {
                throw new Error("branch_id inválido");
            }

            const branch = await branchService.findById(branchId);

            res.json({
                success: true,
                data: branch,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualiza los datos de una sucursal.
     *
     * @param {import('express').Request} req - Request con branch_id en params y datos en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si la sucursal no existe
     * @throws {ValidationError} Si los datos son inválidos
     *
     * @example
     * PATCH /api/vendors/branches/1
     * { "branch_name": "Sucursal Norte", "branch_address": "Av. Siempre Viva 742" }
     */
    async update(req, res, next) {
        try {
            const branchId = parseInt(req.params.branch_id);

            if (isNaN(branchId)) {
                throw new Error("branch_id inválido");
            }

            const branch = await branchService.update(branchId, req.body);

            res.json({
                success: true,
                message: "Sucursal actualizada exitosamente",
                data: branch,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualiza el estado de una sucursal.
     *
     * @param {import('express').Request} req - Request con branch_id en params y branch_status en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si la sucursal no existe
     * @throws {ValidationError} Si el estado no es válido
     *
     * @example
     * PATCH /api/vendors/branches/1/status
     * { "branch_status": "MAINTENANCE" }
     */
    async updateStatus(req, res, next) {
        try {
            const branchId = parseInt(req.params.branch_id);

            if (isNaN(branchId)) {
                throw new Error("branch_id inválido");
            }

            const { branch_status } = req.body;

            const branch = await branchService.updateStatus(
                branchId,
                branch_status,
            );

            res.json({
                success: true,
                message: "Estado de la sucursal actualizado exitosamente",
                data: branch,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Desactiva una sucursal (borrado lógico, establece estado INACTIVE).
     *
     * @param {import('express').Request} req - Request con branch_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {NotFoundError} Si la sucursal no existe
     *
     * @example
     * DELETE /api/vendors/branches/1
     */
    async deactivate(req, res, next) {
        try {
            const branchId = parseInt(req.params.branch_id);

            if (isNaN(branchId)) {
                throw new Error("branch_id inválido");
            }

            await branchService.deactivate(branchId);

            res.json({
                success: true,
                message: "Sucursal desactivada exitosamente",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BranchController();
