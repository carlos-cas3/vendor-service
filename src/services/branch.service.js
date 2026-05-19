const branchRepository = require("../repositories/branch.repository");

const vendorRepository = require("../repositories/vendor.repository");

const cityRepository = require("../repositories/city.repository");

const { ValidationError, NotFoundError } = require("../utils/errors");

class BranchService {
    async create(vendorId, data) {
        const vendor = await vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }

        await this._validateCreate(data);

        return branchRepository.create({
            vendor_id: vendorId,

            city_id: data.city_id,

            branch_name: data.branch_name || null,

            branch_address: data.branch_address,

            branch_status: "ACTIVE",
        });
    }

    async findByVendorId(vendorId) {
        const vendor = await vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }

        return branchRepository.findByVendorId(vendorId);
    }

    async findById(branchId) {
        const branch = await branchRepository.findById(branchId);

        if (!branch) {
            throw new NotFoundError("Sucursal no encontrada");
        }

        return branch;
    }

    async update(branchId, data) {
        await this.findById(branchId);

        await this._validateUpdate(data);

        return branchRepository.update(branchId, {
            city_id: data.city_id,

            branch_name: data.branch_name || null,

            branch_address: data.branch_address,
        });
    }

    async updateStatus(branchId, branchStatus) {
        const validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

        if (!validStatuses.includes(branchStatus)) {
            throw new ValidationError(
                `Estado inválido. Debe ser: ${validStatuses.join(", ")}`,
            );
        }

        await this.findById(branchId);

        return branchRepository.updateStatus(branchId, branchStatus);
    }

    async deactivate(branchId) {
        await this.findById(branchId);

        return branchRepository.updateStatus(branchId, "INACTIVE");
    }

    async _validateCreate(data) {
        const errors = [];

        if (!data.city_id || isNaN(data.city_id)) {
            errors.push("city_id es requerido");
        }

        if (!data.branch_address || typeof data.branch_address !== "string") {
            errors.push("branch_address es requerido");
        }

        if (data.branch_name && typeof data.branch_name !== "string") {
            errors.push("branch_name debe ser texto");
        }

        const city = await cityRepository.findById(data.city_id);

        if (!city) {
            errors.push("La ciudad no existe");
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join("; "));
        }
    }

    async _validateUpdate(data) {
        const errors = [];

        if (data.city_id && isNaN(data.city_id)) {
            errors.push("city_id inválido");
        }

        if (data.branch_address && typeof data.branch_address !== "string") {
            errors.push("branch_address inválido");
        }

        if (data.branch_name && typeof data.branch_name !== "string") {
            errors.push("branch_name inválido");
        }

        if (data.city_id) {
            const city = await cityRepository.findById(data.city_id);

            if (!city) {
                errors.push("La ciudad no existe");
            }
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join("; "));
        }
    }
}

module.exports = new BranchService();
