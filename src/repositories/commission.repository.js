const supabase = require("../database/connection");

class CommissionRepository {
    /**
     * Inserta una configuración de comisión.
     *
     * @param {Object} data - Datos de la comisión
     * @returns {Promise<Object>} Configuración creada
     */
    async create(data) {
        const { data: config, error } = await supabase
            .from("commission_config")
            .insert([
                {
                    vendor_id: data.vendor_id,
                    commission_rate: data.commission_rate,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return config;
    }

    /**
     * Lista configuraciones de comisión de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Lista de configuraciones
     */
    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("commission_config")
            .select("*")
            .eq("vendor_id", vendorId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    /**
     * Busca una configuración por su ID.
     *
     * @param {number} id - ID de la configuración
     * @returns {Promise<Object|null>} Configuración o null
     */
    async findById(id) {
        const { data, error } = await supabase
            .from("commission_config")
            .select("*")
            .eq("config_id", id)
            .single();

        if (error && error.code === "PGRST116") return null;
        if (error) throw error;
        return data;
    }

    /**
     * Actualiza la tasa de comisión de una configuración.
     *
     * @param {number} id - ID de la configuración
     * @param {number} commission_rate - Nueva tasa
     * @returns {Promise<Object>} Configuración actualizada
     */
    async update(id, commission_rate) {
        const { data: config, error } = await supabase
            .from("commission_config")
            .update({
                commission_rate,
                updated_at: new Date(),
            })
            .eq("config_id", id)
            .select()
            .single();

        if (error) throw error;
        return config;
    }

    /**
     * Elimina una configuración de comisión.
     *
     * @param {number} id - ID de la configuración
     * @returns {Promise<boolean>} true si se eliminó
     */
    async delete(id) {
        const { error } = await supabase
            .from("commission_config")
            .delete()
            .eq("config_id", id);

        if (error) throw error;
        return true;
    }
}

module.exports = new CommissionRepository();
