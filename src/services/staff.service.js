const authClient = require("../clients/auth.client");
const staffRepository = require("../repositories/staff.repository");
const {
    ConflictError,
    NotFoundError,
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

    async getStaffById(staffId, vendor_id) {
        const staff = await staffRepository.findById(staffId);
        if (!staff || staff.vendor_id !== vendor_id) {
            throw new NotFoundError("Staff no encontrado");
        }
        return staff;
    }

    async updateStaff(staffId, vendor_id, data) {
        const staff = await this.getStaffById(staffId, vendor_id);

        if (data.email && data.email !== staff.email) {
            const existing = await staffRepository.findByEmail(
                vendor_id,
                data.email,
                staffId,
            );
            if (existing) {
                throw new ConflictError(
                    "El email ya está registrado para otro staff de este vendor",
                );
            }
        }

        await authClient.updateUser(staff.user_id, data);

        const updated = await staffRepository.update(staffId, data);
        return updated;
    }

    async deactivateStaff(staffId, vendor_id) {
        const staff = await this.getStaffById(staffId, vendor_id);

        await authClient.updateUserStatus(staff.user_id, "INACTIVE");

        const updated = await staffRepository.updateStatus(staffId, "INACTIVE");
        return updated;
    }
}

module.exports = new StaffService();
