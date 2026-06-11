const authClient = require("../clients/auth.client");
const staffRepository = require("../repositories/staff.repository");
const {
    ConflictError,
    ValidationError,
} = require("../utils/errors");

class StaffService {
    async createStaff(data, vendor_id) {
        const result = await authClient.createInternalUser({
            ...data,
            vendor_id,
        });

        try {
            const staff = await staffRepository.create({
                user_id: result.user_id,
                vendor_id,
                role_id: data.role_id,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                personal_phone: data.personal_phone,
            });

            return staff;
        } catch (error) {
            console.error(
                `[ORPHAN] Usuario creado en auth-service (user_id=${result.user_id}) pero falló insert local. Limpiar manualmente.`,
            );
            throw new Error(
                "Error al guardar el staff localmente, el usuario en auth-service queda registrado",
            );
        }
    }

    async getStaff(vendor_id) {
        const staff = await staffRepository.findByVendorId(vendor_id);
        return staff;
    }
}

module.exports = new StaffService();
