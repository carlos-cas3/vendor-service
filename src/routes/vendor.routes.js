const { Router } = require('express');
const vendorController = require('../controllers/vendor.controller');
const branchController = require('../controllers/branch.controller');

const router = Router();

// ==================== VENDORS ====================

// Interno (con auth)
router.post('/', vendorController.create);
router.get('/', vendorController.findAll);
router.get('/:vendor_id', vendorController.findById);
router.put('/:vendor_id', vendorController.update);
router.patch('/:vendor_id/status', vendorController.updateStatus);

// Externo (para otros MS)
router.get('/:vendor_id/status', vendorController.getStatus);

// ==================== BRANCHES ====================

router.post('/:vendor_id/branches', branchController.create);
router.get('/:vendor_id/branches', branchController.findByVendorId);

// Rutas directas de branch (fuera de /vendors)
const directBranchRouter = Router();
directBranchRouter.get('/branches/:branch_id', branchController.findById);
directBranchRouter.put('/branches/:branch_id', branchController.update);
directBranchRouter.patch('/branches/:branch_id/status', branchController.updateStatus);
directBranchRouter.delete('/branches/:branch_id', branchController.delete);

module.exports = { router, directBranchRouter };
