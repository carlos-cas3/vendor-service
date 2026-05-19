const branchService = require("../services/branch.service");

class BranchController {
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
