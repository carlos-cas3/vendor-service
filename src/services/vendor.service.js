const vendorRepository = require("../repositories/vendor.repository");
const {
    ValidationError,
    NotFoundError,
    ConflictError,
} = require("../utils/errors");
const axios = require("axios");
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

class VendorService {
    async createVendor(data) {
        this._validateCreate(data);

        const vendor = await vendorRepository.create(data);

        if (data.categories?.length > 0) {
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

    async findById(vendor_id) {
        const vendor = await vendorRepository.findById(vendor_id);
        if (!vendor) {
            throw new NotFoundError("Proveedor no encontrado");
        }
        return vendor;
    }

    async update(vendor_id, data) {
        const vendor = await this.findById(vendor_id);

        if (data.vendor_email && data.vendor_email !== vendor.vendor_email) {
            const existingEmail = await vendorRepository.findByEmail(
                data.vendor_email,
            );
            if (existingEmail) {
                throw new ConflictError(
                    "El email ya está registrado por otro proveedor",
                ); 
            }
        }

        if (data.vendor_ruc && data.vendor_ruc !== vendor.vendor_ruc) {
            const existingTaxId = await vendorRepository.findByTaxId(
                data.vendor_ruc,
            );
            if (existingTaxId) {
                throw new ConflictError(
                    "El RUC ya está registrado por otro proveedor",
                );
            }
        }

        return vendorRepository.update(vendor_id, data);
    }

    async updateStatus(vendor_id, status) {
        const validStatuses = ["PENDING", "ACTIVE", "INACTIVE", "SUSPENDED"];
        if (!validStatuses.includes(status)) {
            throw new ValidationError(
                `Estado inválido. Debe ser: ${validStatuses.join(", ")}`,
            );
        }

        const vendor = await this.findById(vendor_id);
        const updated = await vendorRepository.updateStatus(vendor_id, status);

        if (vendor.user_id) {
            try {
                await axios.patch(
                    `${AUTH_SERVICE_URL}/api/auth/users/${vendor.user_id}/status`,
                    { status },
                    { timeout: 5000 },
                );
            } catch (error) {
                console.error("Error notificando auth-service:", error.message);
            }
        }

        return updated;
    }

    async getStatus(vendor_id) {
        const vendor = await this.findById(vendor_id);
        return { vendor_id: vendor.vendor_id, status: vendor.vendor_status };
    }

    _validateCreate(data) {
        const errors = [];

        if (!data.vendor_name) {
            errors.push("vendor_name es requerido");
        }

        if (!data.vendor_email || !this._isValidEmail(data.vendor_email)) {
            errors.push("Email válido es requerido");
        }

        if (!data.vendor_ruc) {
            errors.push("RUC es requerido");
        }

        if (!data.user_id) {
            errors.push("user_id es requerido");
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
