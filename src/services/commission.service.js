const commissionRepository = require("../repositories/commission.repository");
const vendorRepository = require("../repositories/vendor.repository");
const { NotFoundError, ValidationError } = require("../utils/errors");

class CommissionService {
    async findByVendorId(vendorId) {
        const vendor = await vendorRepository.findById(vendorId);
        if (!vendor) throw new NotFoundError("Proveedor no encontrado");

        return commissionRepository.findByVendorId(vendorId);
    }

    async create(vendorId, data) {
        const vendor = await vendorRepository.findById(vendorId);
        if (!vendor) throw new NotFoundError("Proveedor no encontrado");

        this._validate(data.commission_rate);

        return commissionRepository.create({
            vendor_id: vendorId,
            commission_rate: data.commission_rate,
        });
    }

    async update(configId, data) {
        const config = await commissionRepository.findById(configId);
        if (!config) throw new NotFoundError("Configuración no encontrada");

        this._validate(data.commission_rate);

        return commissionRepository.update(configId, data.commission_rate);
    }

    async delete(configId) {
        const config = await commissionRepository.findById(configId);
        if (!config) throw new NotFoundError("Configuración no encontrada");

        return commissionRepository.delete(configId);
    }

    _validate(commission_rate) {
        if (commission_rate === undefined || commission_rate === null) {
            throw new ValidationError("commission_rate es requerido");
        }
        if (
            isNaN(commission_rate) ||
            commission_rate < 0 ||
            commission_rate > 1
        ) {
            throw new ValidationError(
                "commission_rate debe ser un número entre 0 y 1",
            );
        }
    }
}

module.exports = new CommissionService();
