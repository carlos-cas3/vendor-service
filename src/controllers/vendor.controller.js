const vendorService = require('../services/vendor.service');

class VendorController {
  async create(req, res, next) {
    try {
      const vendor = await vendorService.createVendor(req.body);
      res.status(201).json({
        success: true,
        message: 'Proveedor creado exitosamente',
        data: vendor,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        email: req.query.email,
        tax_id: req.query.tax_id,
      };

      Object.keys(filters).forEach(k => {
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

  async findById(req, res, next) {
    try {
      const vendor = await vendorService.findById(req.params.id);
      res.json({
        success: true,
        data: vendor,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const vendor = await vendorService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Proveedor actualizado exitosamente',
        data: vendor,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const vendor = await vendorService.updateStatus(req.params.id, req.body.status);
      res.json({
        success: true,
        message: 'Estado del proveedor actualizado exitosamente',
        data: vendor,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req, res, next) {
    try {
      const result = await vendorService.getStatus(req.params.id);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VendorController();
