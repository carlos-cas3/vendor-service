const branchRepository = require('../repositories/branch.repository');
const vendorRepository = require('../repositories/vendor.repository');
const { ValidationError, NotFoundError } = require('../utils/errors');

class BranchService {
  async create(vendorId, data) {
    const vendor = await vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new NotFoundError('Proveedor no encontrado');
    }

    this._validateCreate(data);

    const branch = await branchRepository.create({
      ...data,
      vendor_id: vendorId,
    });

    return branch;
  }

  async findByVendorId(vendorId, filters = {}) {
    const vendor = await vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new NotFoundError('Proveedor no encontrado');
    }

    return branchRepository.findByVendorId(vendorId, filters);
  }

  async findById(id) {
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new NotFoundError('Sucursal no encontrada');
    }
    return branch;
  }

  async update(id, data) {
    await this.findById(id);
    return branchRepository.update(id, data);
  }

  async updateStatus(id, status) {
    const validStatuses = ['ACTIVE', 'INACTIVE'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Estado inválido. Debe ser: ${validStatuses.join(', ')}`);
    }

    await this.findById(id);

    return branchRepository.updateStatus(id, status);
  }

  async delete(id) {
    await this.findById(id);
    return branchRepository.delete(id);
  }

  _validateCreate(data) {
    const errors = [];

    if (!data.vendor_name || typeof data.vendor_name !== 'string') {
      errors.push('vendor_name es requerido');
    }
    if (!data.vendor_address || typeof data.vendor_address !== 'string') {
      errors.push('vendor_address es requerido');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('; '));
    }
  }
}

module.exports = new BranchService();
