const vendorRepository = require("../repositories/vendor.repository");
const { ValidationError, NotFoundError } = require("../utils/errors");

class VendorService {
    async createVendor(data) {
        const vendor = await vendorRepository.create(data);

        if (data.categories && data.categories.length > 0) {
            await vendorRepository.addCategories(
                vendor.vendor_id,
                data.categories,
            );
        }

        return vendor;
    }

    async findAll(filters = {}) {
        return vendorRepository.findAll(filters);
    }

    async findById(id) {
        const vendor = await vendorRepository.findById(id);
        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }
        return vendor;
    }

    async update(id, data) {
        const vendor = await this.findById(id);

        if (data.email && data.email !== vendor.vendor_email) {
            const existingEmail = await vendorRepository.findByEmail(
                data.email,
            );
            if (existingEmail) {
                throw new ValidationError(
                    "El email ya está registrado por otro proveedor",
                );
            }
        }

        if (data.ruc && data.ruc !== vendor.vendor_ruc) {
            const existingTaxId = await vendorRepository.findByTaxId(data.ruc);
            if (existingTaxId) {
                throw new ValidationError(
                    "El RUC ya está registrado por otro proveedor",
                );
            }
        }
        return vendorRepository.update(id, data);
    }

    async updateStatus(id, status) {  
        const validStatuses = ["PENDING", "ACTIVE", "INACTIVE", "SUSPENDED"];
        if (!validStatuses.includes(status)) {
            throw new ValidationError(
                `Estado inválido. Debe ser: ${validStatuses.join(", ")}`,
            );
        }

        await this.findById(id);

        return vendorRepository.updateStatus(id, status);
    }

    async getStatus(id) {
        const vendor = await this.findById(id);
        return { vendor_id: vendor.vendor_id, status: vendor.status };
    }

    _validateCreate(data) {
        const errors = [];

        if (!data.email || !this._isValidEmail(data.email)) {
            errors.push("email válido es requerido");
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join("; "));
        }
    }

    _isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

module.exports = new VendorService();
