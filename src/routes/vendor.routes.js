const { Router } = require('express');
const vendorController = require('../controllers/vendor.controller');
const branchController = require('../controllers/branch.controller');

const router = Router();

// ==================== VENDORS ====================

// Interno (con auth)
router.post('/', vendorController.create);
router.get('/', vendorController.findAll);
router.get('/:id', vendorController.findById);
router.put('/:id', vendorController.update);
router.patch('/:id/status', vendorController.updateStatus);

// Externo (para otros MS)
router.get('/:id/status', vendorController.getStatus);

// ==================== BRANCHES ====================

router.post('/:vendorId/branches', branchController.create);
router.get('/:vendorId/branches', branchController.findByVendorId);

// Rutas directas de branch (fuera de /vendors)
const directBranchRouter = Router();
directBranchRouter.get('/branches/:id', branchController.findById);
directBranchRouter.put('/branches/:id', branchController.update);
directBranchRouter.patch('/branches/:id/status', branchController.updateStatus);
directBranchRouter.delete('/branches/:id', branchController.delete);

module.exports = { router, directBranchRouter };
