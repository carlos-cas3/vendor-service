const supabase = require("../database/connection");

class StaffRepository {
    /**
     * Crea un registro de staff en la base de datos.
     *
     * @param {{ user_id: number, vendor_id: number, role_id: number, first_name: string, last_name: string, email: string, personal_phone?: string }} data - Datos del staff
     * @returns {Promise<Object>} Staff creado
     */
    async create(data) {
        const { data: staff, error } = await supabase
            .from("vendor_staff")
            .insert([
                {
                    user_id: data.user_id,
                    vendor_id: data.vendor_id,
                    role_id: data.role_id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    personal_phone: data.personal_phone || null,
                },
            ])
            .select("*")
            .single();

        if (error) throw error;

        return staff;
    }

    /**
     * Obtiene el staff activo de un vendor.
     *
     * @param {number} vendorId - ID del vendor
     * @returns {Promise<Array>} Lista de staff activo
     */
    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("vendor_staff")
            .select("*")
            .eq("vendor_id", vendorId)
            .eq("status", "ACTIVE")
            .order("created_at", { ascending: true });

        if (error) throw error;

        return data;
    }

    /**
     * Obtiene un staff por su ID.
     *
     * @param {number} staffId - ID del staff
     * @returns {Promise<Object|null>} Staff encontrado o null
     */
    async findById(staffId) {
        const { data: staff, error } = await supabase
            .from("vendor_staff")
            .select("*")
            .eq("staff_id", staffId)
            .single();

        if (error && error.code === "PGRST116") return null;
        if (error) throw error;

        return staff;
    }

    /**
     * Busca staff por email dentro de un vendor, opcionalmente excluyendo un ID.
     *
     * @param {number} vendorId - ID del vendor
     * @param {string} email - Email a buscar
     * @param {number} [excludeId] - staff_id a excluir (para validación en actualización)
     * @returns {Promise<Object|null>} Staff encontrado o null
     */
    async findByEmail(vendorId, email, excludeId) {
        let query = supabase
            .from("vendor_staff")
            .select("*")
            .eq("vendor_id", vendorId)
            .eq("email", email);

        if (excludeId) {
            query = query.neq("staff_id", excludeId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) throw error;

        return data;
    }

    /**
     * Actualiza los datos de un staff.
     *
     * @param {number} staffId - ID del staff
     * @param {Object} data - Campos a actualizar
     * @returns {Promise<Object>} Staff actualizado
     */
    async update(staffId, data) {
        const { data: staff, error } = await supabase
            .from("vendor_staff")
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq("staff_id", staffId)
            .select("*")
            .single();

        if (error) throw error;

        return staff;
    }

    /**
     * Actualiza el estado de un staff (activo/inactivo).
     *
     * @param {number} staffId - ID del staff
     * @param {string} status - Nuevo estado (ACTIVE, INACTIVE)
     * @returns {Promise<Object>} Staff actualizado
     */
    async updateStatus(staffId, status) {
        const { data: staff, error } = await supabase
            .from("vendor_staff")
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq("staff_id", staffId)
            .select("*")
            .single();

        if (error) throw error;

        return staff;
    }
}

module.exports = new StaffRepository();
