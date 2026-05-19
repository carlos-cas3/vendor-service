const vendorPolicyRepository = require("../repositories/vendor-policy.repository");

class PolicyService {
    async findByVendorId(vendorId) {
        return vendorPolicyRepository.findByVendorId(vendorId);
    }

    async upsert(vendorId, description) {
        if (!description) throw new Error("La descripción es requerida");
        return vendorPolicyRepository.upsert(vendorId, description);
    }
}

module.exports = new PolicyService();
