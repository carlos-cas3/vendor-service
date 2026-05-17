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
        vendor_status: req.query.vendor_status,
        vendor_email: req.query.vendor_email,
        vendor_ruc: req.query.vendor_ruc,
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
      const vendor = await vendorService.findById(req.params.vendor_id);
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
      const vendor = await vendorService.update(req.params.vendor_id, req.body);
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
      const vendor = await vendorService.updateStatus(req.params.vendor_id, req.body.status);
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
      const result = await vendorService.getStatus(req.params.vendor_id);
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
