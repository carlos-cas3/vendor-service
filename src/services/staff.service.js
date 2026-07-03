const authClient = require("../clients/auth.client");
const staffRepository = require("../repositories/staff.repository");
const {
    ConflictError,
    NotFoundError,
    ValidationError,
} = require("../utils/errors");
const { sendEvent } = require("../clients/analytics.client");

class StaffService {
    /**
     * Crea un staff local y su usuario en auth-service.
     *
     * @param {{ first_name: string, last_name: string, email: string, personal_phone?: string, role_id: number }} data - Datos del staff
     * @param {number} vendor_id - ID del vendor
     * @returns {Promise<Object>} Staff creado
     * @throws {ConflictError} Si el email ya está registrado en auth-service
     */
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

            sendEvent({
                type: "STAFF_CREATED",
                aggregateType: "staff",
                aggregateId: staff.staff_id,
                vendorIds: [String(vendor_id)],
                payload: { email: staff.email, role_id: staff.role_id },
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

    /**
     * Obtiene el staff activo de un vendor.
     *
     * @param {number} vendor_id - ID del vendor
     * @returns {Promise<Array>} Lista de staff activo
     */
    async getStaff(vendor_id) {
        const staff = await staffRepository.findByVendorId(vendor_id);
        return staff;
    }

    /**
     * Obtiene un miembro del staff por ID, validando que pertenezca al vendor.
     *
     * @param {number} staffId - ID del staff
     * @param {number} vendor_id - ID del vendor
     * @returns {Promise<Object>} Staff encontrado
     * @throws {NotFoundError} Si no existe o no pertenece al vendor
     */
    async getStaffById(staffId, vendor_id) {
        const staff = await staffRepository.findById(staffId);
        if (!staff || staff.vendor_id !== vendor_id) {
            throw new NotFoundError("Staff no encontrado");
        }
        return staff;
    }

    /**
     * Actualiza un miembro del staff y sincroniza con auth-service.
     *
     * @param {number} staffId - ID del staff
     * @param {number} vendor_id - ID del vendor
     * @param {{ first_name?: string, last_name?: string, email?: string, personal_phone?: string, availability_status?: string }} data - Datos a actualizar
     * @returns {Promise<Object>} Staff actualizado
     * @throws {NotFoundError} Si el staff no existe
     * @throws {ConflictError} Si el email ya está registrado para otro staff del mismo vendor
     */
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

        sendEvent({
            type: "STAFF_UPDATED",
            aggregateType: "staff",
            aggregateId: staffId,
            vendorIds: [String(vendor_id)],
            payload: data,
        });

        return updated;
    }

    /**
     * Desactiva un miembro del staff (borrado lógico) y su usuario en auth-service.
     *
     * @param {number} staffId - ID del staff
     * @param {number} vendor_id - ID del vendor
     * @returns {Promise<Object>} Staff desactivado
     * @throws {NotFoundError} Si el staff no existe
     */
    async deactivateStaff(staffId, vendor_id) {
        const staff = await this.getStaffById(staffId, vendor_id);

        await authClient.updateUserStatus(staff.user_id, "INACTIVE");

        const updated = await staffRepository.updateStatus(staffId, "INACTIVE");

        sendEvent({
            type: "STAFF_STATUS_CHANGED",
            aggregateType: "staff",
            aggregateId: staffId,
            vendorIds: [String(vendor_id)],
            payload: { status: "INACTIVE" },
        });

        return updated;
    }
}

module.exports = new StaffService();
