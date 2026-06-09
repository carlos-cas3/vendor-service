const authClient = require("../clients/auth.client");
const {
    ConflictError,
    ValidationError,
} = require("../utils/errors");

class StaffService {
    async createStaff(data, vendor_id) {
        try {
            const result = await authClient.createInternalUser({
                ...data,
                vendor_id,
            });
            return result;
        } catch (error) {
            if (error.code === "EMAIL_CONFLICT") {
                throw new ConflictError(error.message);
            }
            if (error.code === "VALIDATION_ERROR") {
                throw new ValidationError(error.message);
            }
            throw new Error(
                "Error al crear usuario en el servicio de autenticación",
            );
        }
    }

    async getStaff(vendorId) {
        const result = await authClient.getInternalUsers(vendorId);
        return result;
    }
}

module.exports = new StaffService();
