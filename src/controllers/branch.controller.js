const branchService = require('../services/branch.service');

class BranchController {
  async create(req, res, next) {
    try {
      const branch = await branchService.create(req.params.vendorId, req.body);
      res.status(201).json({
        success: true,
        message: 'Sucursal creada exitosamente',
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByVendorId(req, res, next) {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status;

      const branches = await branchService.findByVendorId(req.params.vendorId, filters);
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
      const branch = await branchService.findById(req.params.id);
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
      const branch = await branchService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Sucursal actualizada exitosamente',
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const branch = await branchService.updateStatus(req.params.id, req.body.status);
      res.json({
        success: true,
        message: 'Estado de la sucursal actualizado exitosamente',
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await branchService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Sucursal eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BranchController();
